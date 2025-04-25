from Script_3 import *
import re 
import pandas as pd

pd.set_option('display.float_format', lambda x: '%.0f' % x)
HEADER_KEYWORDS = ["atgärd", "kategori", "läge", "intervall", "status", "totalt pris", "inkl. moms"]

def get_year(lines):
    page_year = {}
    for line in lines:
        text = line.get("Line Text", "")
        if re.fullmatch(r"\d{4}", text):
            page = line.get("Page Number")
            if page is not None:
                page_year[page] = int(text)
    return page_year

def get_cost(text):
    cleaned_text = re.split(r"(?i)faktiskt pris:", text, maxsplit=1)[0]
    cost_str = re.sub(r"[^\d]", "", cleaned_text)
    if cost_str:
        return float(cost_str)
    return 0.0

def clean_cells(table):
    rows = defaultdict(list)
    for cell in table["Cells"]:
        rows[cell["RowIndex"]].append(cell)
    cleaned_cells = []
    for row_idx, row_cells in rows.items():
        filtered_row_cells = [c for c in row_cells if c.get("CellConfidence", 100) >= 50]
        if not filtered_row_cells:
            continue
        row_texts = [c["CellText"] for c in filtered_row_cells if c["CellText"].strip()]
        if not row_texts:
            continue
        cleaned_cells.extend(filtered_row_cells)
    cleaned_cells.sort(key=lambda c: (c["RowIndex"], c["ColumnIndex"]))
    return cleaned_cells

def clean_tables(tables):
    cleaned_tables = []
    for table in tables:
        new_table = dict(table)
        new_table["Cells"] = clean_cells(table)
        cleaned_tables.append(new_table)
    return cleaned_tables

def check_table_header(tbl_cells, max_rows=1):
    if not tbl_cells:
        return False
    row_indices = sorted({c["RowIndex"] for c in tbl_cells})
    for row_idx in row_indices[:max_rows]:
        row_text = " ".join(cell.get("CellText", "").lower() for cell in tbl_cells if cell["RowIndex"] == row_idx)
        match_count = sum(1 for kw in HEADER_KEYWORDS if kw in row_text)
        if match_count >= 3:
            return row_idx
    return None    

def tabel_analysis(tbl1, tbl2):
    page_diff = abs(tbl1["PageNumber"] - tbl2["PageNumber"])
    if page_diff > 1:
        return False
    if check_table_header(tbl2["Cells"]):
        return False
    return True 

def merge_tables(tbl1, tbl2):
    merged = {
        "PageNumber": min(tbl1["PageNumber"], tbl2["PageNumber"]),
        "TableID": f"{tbl1['TableID']}_merged_{tbl2['TableID']}",
        "Cells": tbl1["Cells"] + tbl2["Cells"]
    }
    return merged

def multi_page_tables(tables):
    tables_sorted = sorted(tables, key=lambda t: (t["PageNumber"], t["TableID"]))
    merged = []
    for tbl in tables_sorted:
        if not merged:
            merged.append(tbl)
        else:
            prev = merged[-1]
            if tabel_analysis(prev, tbl):
                merged[-1] = merge_tables(prev, tbl)
            else:
                merged.append(tbl)
    return merged

def find_all_headers(cells):
    """Find all rows that match header criteria"""
    if not cells:
        return []
    
    all_row_indices = sorted({c["RowIndex"] for c in cells})
    header_rows = []
    
    for row_idx in all_row_indices:
        row_text = " ".join(cell.get("CellText", "").lower() for cell in cells if cell["RowIndex"] == row_idx)
        match_count = sum(1 for kw in HEADER_KEYWORDS if kw in row_text)
        if match_count >= 3:
            header_rows.append(row_idx)
    
    return header_rows

def extract_costs_by_year(tables, page_year):
    """Extract cost data from tables organized by year"""
    year_costs = defaultdict(list)
    
    # First, associate tables with years
    for table in tables:
        page = table.get("PageNumber")
        year = page_year.get(page)
        
        if year is None:
            continue
            
        # Extract costs from this table
        for cell in table.get("Cells", []):
            text = cell.get("CellText", "")
            if "kr" in text.lower():
                cost_val = get_cost(text)
                if cost_val > 0:
                    row_idx = cell.get("RowIndex")
                    year_costs[year].append({
                        "Year": year,
                        "Page": page,
                        "TableID": table.get("TableID", ""),
                        "CellText": text,
                        "Cost": cost_val,
                        "RowIndex": row_idx,
                    })
    
    return year_costs

def create_modified_summary(year_costs):
    """Create a modified summary by adjusting years with count=2"""
    records = []
    
    # Process each year
    for year, costs in sorted(year_costs.items()):
        # Count tables for this year
        table_count = len(set(cost["TableID"] for cost in costs))
        
        if table_count == 2:
            # This year needs splitting - find the costs from each table
            table_ids = sorted(set(cost["TableID"] for cost in costs))
            
            # Group costs by table ID
            costs_by_table = defaultdict(list)
            for cost in costs:
                costs_by_table[cost["TableID"]].append(cost)
            
            # First table goes to previous year
            if len(table_ids) >= 1:
                first_table_costs = costs_by_table[table_ids[0]]
                for cost in first_table_costs:
                    # Copy the record but change the year
                    modified_cost = dict(cost)
                    modified_cost["Year"] = year - 1
                    records.append(modified_cost)
            
            # Second table stays in current year
            if len(table_ids) >= 2:
                second_table_costs = costs_by_table[table_ids[1]]
                for cost in second_table_costs:
                    modified_cost = dict(cost)
                    modified_cost["Year"] = year
                    records.append(modified_cost)
        else:
            # For years with 1 table, keep as is
            records.extend(costs)
    
    # Create DataFrame
    df = pd.DataFrame(records)
    if df.empty:
        return df, pd.DataFrame()
    
    # Generate summary
    summary_df = (
        df.groupby("Year", dropna=False).agg(
            Table_Count=("TableID", lambda x: len(set(x))),
            Total_Cost=("Cost", "sum"),
            Average_Cost=("Cost", "mean"),
            Min_Cost=("Cost", "min"),
            Max_Cost=("Cost", "max"),
            Cost_enteries=("Cost", "count")
        ).reset_index()
    )
    
    # Sort by year
    summary_df = summary_df.sort_values("Year")
    
    return df, summary_df

def tabular_analysis(tables, page_year):
    """New implementation to handle table splitting correctly"""
    # Extract all costs from tables organized by year
    year_costs = extract_costs_by_year(tables, page_year)
    
    # Create modified summary with table splitting
    df, summary_df = create_modified_summary(year_costs)
    # summary_df = summary_df.set_index("Year")
    
    return df, summary_df

def statistical_analysis(tables, lines):
    page_year = get_year(lines)
    cleaned_tables = clean_tables(tables)
    proper_tables = multi_page_tables(cleaned_tables)
    df, summary_df = tabular_analysis(proper_tables, page_year)
    return df, summary_df

if __name__ == "__main__":
    # Example usage
    pages = load_ocr_data("output.txt")
    blocks_by_id = block_lookup(pages)
    lines = get_lines(pages, blocks_by_id)
    tables = get_tables(pages, blocks_by_id)
    
    df, summary_df = statistical_analysis(tables, lines)
    print("DataFrame:\n", df)
    print("Summary DataFrame:\n", summary_df)

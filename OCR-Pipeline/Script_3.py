from Script_2 import *
from collections import defaultdict

def load_ocr_data(filename= 'output.txt'):
    blocks = []
    with open(filename, 'r', encoding='utf-8') as file:
        for line in file:
            line = line.strip()
            if not line:
                continue
            try:
                block = json.loads(line)
            except json.JSONDecodeError as error:
                print(f"Error decoding JSON: {error}")
                continue
            blocks.append(block)
    pages_map = defaultdict(list)
    for block in blocks:
        page_num = block.get('Page', 1)
        pages_map[page_num].append(block)
    
    pages_list = [{"Blocks": pages_map[pg]} for pg in sorted(pages_map.keys())]
    return pages_list

def block_lookup(pages):
    if not pages:
        raise ValueError("No pages found in the input data.")
    
    block_map = {}
    for page_idx, page in enumerate(pages):
        blocks = page.get("Blocks", [])
        if blocks is None:
            raise ValueError(f"Missing Blocks in page {page_idx}")
        for block in blocks:
            block_id = block.get("Id")
            if not block_id:
                continue
            block_map[block_id] = block
    return block_map

def get_lines(pages, blocks_by_id):
    textual_data = []
    for page_idx, page in enumerate(pages, start=1):
        blocks = page.get("Blocks", [])
        for block in blocks:
            if block.get("BlockType", "") == "LINE":
                line_text = block.get("Text", "")
                line_confidence = block.get("Confidence", 0.000)
                page_number = block.get("Page", page_idx)

                words_text = []
                for rel in block.get("Relationships", []):
                    if rel.get("Type") == "CHILD":
                        for child_id in rel.get("Ids", []):
                            child_block = blocks_by_id.get(child_id)
                            if child_block and child_block.get("BlockType") == "WORD":
                                words_text.append(child_block.get("Text", ""))
                textual_data.append({
                    "Page Number" : page_number,
                    "Line Text": line_text,
                    "Line Confidence": line_confidence,
                    "Words" : words_text
                })
    return textual_data

def get_tables(pages, blocks_by_id):
    table_data = []
    for page_idx, page in enumerate(pages, start=1):
        blocks = page.get("Blocks", [])
        for block in blocks:
            if block.get("BlockType", "") == "TABLE":
                table_id = block.get("Id", "")
                table_confidence = block.get("Confidence", 0.000)
                page_num = block.get("Page", page_idx)
                table_cells = []
                for rel in block.get("Relationships", []):
                    if rel.get("Type") == "CHILD":
                        for child_id in rel.get("Ids", []):
                            cell_block = blocks_by_id.get(child_id)
                            if cell_block and cell_block.get("BlockType") == "CELL":
                                row_index = cell_block.get("RowIndex")
                                col_index = cell_block.get("ColumnIndex")
                                cell_confidence = cell_block.get("Confidence", 0.000)
                                cell_words = []
                                for cell_rel in cell_block.get("Relationships", []):
                                    if cell_rel.get("Type") == "CHILD":
                                        for word_id in cell_rel.get("Ids", []):
                                            word_block = blocks_by_id.get(word_id)
                                            if word_block and word_block.get("BlockType") == "WORD":
                                                cell_words.append(word_block.get("Text", ""))
                                cell_text = " ".join(cell_words)
                                table_cells.append({
                                    "RowIndex": row_index,
                                    "ColumnIndex": col_index,
                                    "CellConfidence": cell_confidence,
                                    "CellText" : cell_text
                                })
                table_data.append({
                    "PageNumber" : page_num,
                    "TableID": table_id,
                    "TableConfidence": table_confidence,
                    "Cells": table_cells
                })
    return table_data


if __name__ == "__main__":
    # Example usage
    pages = load_ocr_data("output.txt")
    blocks_by_id = block_lookup(pages)
    lines = get_lines(pages, blocks_by_id)
    tables = get_tables(pages, blocks_by_id)
    
    print("Lines: ", lines)
    print("Tables: ", tables)

    with open("lines_output.txt", "w", encoding="utf-8") as f:
        json.dump(lines, f, indent=2, ensure_ascii=False)

    with open("tables_output.txt", "w", encoding="utf-8") as f:
        json.dump(tables, f, indent=2, ensure_ascii=False)

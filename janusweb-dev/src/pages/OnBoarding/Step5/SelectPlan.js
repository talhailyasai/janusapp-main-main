import React from "react";
import Step3 from "../Step3/Step3";

const SelectPlan = ({ setStep, properties, setStopStep, selectPlan }) => {
  //debugger;
  return (
    <div>
      <Step3
        maintenancePlan={"maintenancePlan"}
        setStep={setStep}
        setStopStep={setStopStep}
        selectPlan={selectPlan}
      />
    </div>
  );
};

export default SelectPlan;

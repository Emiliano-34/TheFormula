// src/components/Stepper.js
import React from 'react';
import check from '../assets/check.png';
import './Stepper.css';

const Stepper = ({ currentStep = 1 }) => {
  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className={
            step < currentStep
              ? 'step completed'
              : step === currentStep
              ? 'step active'
              : 'step'
          }>
            {step < currentStep ? (
              <img src={check} alt="check" />
            ) : (
              `0${step}`
            )}
          </div>
          {index < steps.length - 1 && <div className="line"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;

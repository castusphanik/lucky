import React, { useState } from 'react';
import Popup from '../Popup';
import Button from '../Button';
import './styles.scss';

type Step = {
  number: number;
  label: string;
  content: React.ReactNode;
};

type StepperPopupProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  steps: Step[];
};

const StepperPopup = ({ open, onClose, title, steps }: StepperPopupProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <Popup width={1100} title={title} onClose={onClose}>
      <div className="stepper-popup">
        {/* Stepper Header */}
        <div className="stepper-popup__stepper-container">
          <div className="stepper-popup__stepper">
            {steps.map((step, index) => (
              <div key={step.number} className="stepper-popup__step">
                <div
                  className={`stepper-popup__step-circle ${
                    currentStep >= step.number ? 'stepper-popup__step-circle--active' : ''
                  }`}
                >
                  {step.number}
                </div>
                <div className="stepper-popup__step-label">{step.label}</div>
                {index < steps.length - 1 && (
                  <div
                    className={`stepper-popup__step-line ${
                      currentStep > step.number ? 'stepper-popup__step-line--active' : ''
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="stepper-popup__content-container">
          <div className="stepper-popup__step-content">
            {steps.find(step => step.number === currentStep)?.content}
          </div>
        </div>

        {/* Buttons */}
        <div className="stepper-popup__buttons-container">
          <Button
            size="fit"
            classValue="stepper-popup__back-btn"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button
            size="fit"
            color="primary"
            onClick={currentStep === steps.length ? onClose : handleNext}
          >
            {currentStep === steps.length ? 'Finish' : 'Next'}
          </Button>
          <Button size="fit" onClick={onClose} classValue='cancel-btn' >
            Cancel
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default StepperPopup;

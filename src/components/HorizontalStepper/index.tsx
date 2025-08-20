import React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  Typography,
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import './styles.scss';

type StepItem = {
  label: string;
  date?: string;
  status: 'completed' | 'active' | 'skipped' | 'upcoming';
};

type HorizontalStepperProps = {
  steps: StepItem[];
};

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#ccc',
  },
}));

const HorizontalStepper: React.FC<HorizontalStepperProps> = ({ steps }) => {
  return (
    <Stepper alternativeLabel connector={<CustomConnector />} className="horizontal-stepper">
      {steps.map((step, index) => (
        <Step key={index}>
          <StepLabel StepIconComponent={() => getStepIcon(step.status)}>
            <Typography className="step-label">{step.label}</Typography>
            {step.date && <Typography className="step-date">{step.date}</Typography>}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

const getStepIcon = (status: StepItem['status']) => {
  switch (status) {
    case 'completed':
      return (
        <div className="step-icon completed">
          <Check fontSize="small" />
        </div>
      );
    case 'active':
      return <div className="step-icon active" />;
    case 'skipped':
    case 'upcoming':
    default:
      return <RadioButtonUncheckedIcon className="step-icon upcoming" />;
  }
};

export default HorizontalStepper;

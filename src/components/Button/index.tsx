import React, { useState } from 'react';
import './styles.scss';

type ButtonProps = {
  variant?: 'filled' | 'outline';
  color?: 'primary' | 'secondary' | 'light';
  shape?: 'square' | 'pill';
  weight?: 'normal' | 'thin';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'full' | 'lg' | 'md' | 'sm' | 'fit' | 'special-fit';
  onClick?: () => void;
  className?: string;
  children: React.ReactNode | string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = props => {
  const {
    variant = 'filled',
    color = 'primary',
    shape = 'square',
    icon = false,
    iconPosition = 'left',
    size = 'full',
    onClick,
    children,
    className = '',
    weight = 'normal',
    disabled = false,
  } = props;

  const [isHovered, setHovered] = useState(false);

  const buttonClassName = `button ${variant} ${color} ${size} ${weight} ${shape} ${className} ${
    icon ? `icon-${iconPosition}` : ''
  }`;

  return (
    <button
      {...props}
      className={buttonClassName}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && <span className="icon">{icon}</span>}
      {children}

      {icon && iconPosition === 'right' && <span className="icon">{icon}</span>}
    </button>
  );
};

export default Button;

import React from 'react';
import { Link } from 'react-router-dom';

export interface NavCardData {
  titleKey: string;
  descriptionKey: string;
  path: string;
  icon: string;
}

interface NavCardItemProps {
  title: string;
  description: string;
  path: string;
  icon: string;
}

export const NavCardItem: React.FC<NavCardItemProps> = ({ title, description, path, icon }) => {
  return (
    <Link to={path} className="nav-card">
      <div className="nav-card-icon" aria-hidden="true">{icon}</div>
      <h3 className="nav-card-title">{title}</h3>
      <p className="nav-card-description">{description}</p>
    </Link>
  );
};
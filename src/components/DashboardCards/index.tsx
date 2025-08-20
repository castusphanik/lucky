// import React from 'react';
import { cardData } from '@/data/DashboardCardsData';
import './styles.scss';
import InfoCard from '@/components/InfoCard';

export default function DashboardCards() {

  return (
    <div className="dashboard">
  {cardData.map((card, index) => (
    <div key={index} className="cardWrapper">
      <InfoCard
        title={card.title}
        value={card.value}
        iconColor={card.color}
        variant="simplecolor"
      />
    </div>
  ))}
</div>

  );
}

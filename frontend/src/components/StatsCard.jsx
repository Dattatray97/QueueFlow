const StatsCard = ({ icon, title, value, color = 'blue', delay = 0 }) => {
  return (
    <div className={`stat-card ${color} fade-in`} style={{ animationDelay: `${delay}s` }}>
      <div className={`stat-icon ${color}`}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;

import '../dining/dining.css';

export default function MealPlanCard({ plan }) {
  const swipesLeft = plan.mealSwipes.total - plan.mealSwipes.used;
  const swipePercent = (swipesLeft / plan.mealSwipes.total) * 100;
  const dollarPercent = (plan.diningDollars.balance / plan.diningDollars.total) * 100;

  // Days until semester end
  const daysLeft = Math.max(0, Math.ceil((new Date(plan.semesterEnd) - new Date()) / 86400000));

  return (
    <div className="meal-plan-card">
      <div className="mpc-header">
        <div className="mpc-plan-badge">{plan.type} Plan</div>
        <div className="mpc-days">{daysLeft} days left</div>
      </div>

      <div className="mpc-balances">
        {/* Meal Swipes */}
        <div className="mpc-balance-item">
          <div className="mpc-balance-top">
            <span className="mpc-balance-icon">🍽️</span>
            <div className="mpc-balance-info">
              <span className="mpc-balance-label">Meal Swipes</span>
              <span className="mpc-balance-value">
                <strong>{swipesLeft}</strong> / {plan.mealSwipes.total}
              </span>
            </div>
          </div>
          <div className="mpc-bar">
            <div className="mpc-bar-fill cardinal" style={{ width: `${swipePercent}%` }} />
          </div>
        </div>

        {/* Dining Dollars */}
        <div className="mpc-balance-item">
          <div className="mpc-balance-top">
            <span className="mpc-balance-icon">💰</span>
            <div className="mpc-balance-info">
              <span className="mpc-balance-label">Dining Dollars</span>
              <span className="mpc-balance-value">
                <strong>${plan.diningDollars.balance.toFixed(2)}</strong> / ${plan.diningDollars.total.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="mpc-bar">
            <div className="mpc-bar-fill gold" style={{ width: `${dollarPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Today quick stats */}
      <div className="mpc-today">
        <div className="mpc-today-item">
          <span className="mpc-today-num">{plan.mealSwipes.usedToday}/{plan.mealSwipes.perDay}</span>
          <span className="mpc-today-label">swipes today</span>
        </div>
        <div className="mpc-today-sep" />
        <div className="mpc-today-item">
          <span className="mpc-today-num">{plan.getAndGo.usedToday}/{plan.getAndGo.perDay}</span>
          <span className="mpc-today-label">GET & GO</span>
        </div>
        <div className="mpc-today-sep" />
        <div className="mpc-today-item">
          <span className="mpc-today-num">{plan.guestMeals.remaining}</span>
          <span className="mpc-today-label">guest meals</span>
        </div>
      </div>
    </div>
  );
}

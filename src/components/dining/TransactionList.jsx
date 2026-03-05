import './dining.css';

const TYPE_ICONS = {
  swipe: '🍽️',
  'dining-dollars': '💰',
  'get-go': '📱',
};

export default function TransactionList({ transactions }) {
  if (!transactions?.length) return null;

  return (
    <div className="transaction-list widget-card" style={{ margin: 'var(--space-sm) var(--space-lg)' }}>
      {transactions.map((tx) => (
        <div className="tx-item" key={tx.id}>
          <div className="tx-icon">{TYPE_ICONS[tx.type] || '📋'}</div>
          <div className="tx-info">
            <p className="tx-location">{tx.location}</p>
            <p className="tx-detail">{tx.detail}</p>
            <p className="tx-time">{tx.time}</p>
          </div>
          {tx.amount !== null && (
            <span className={`tx-amount ${tx.amount < 0 ? 'debit' : 'credit'}`}>
              {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
            </span>
          )}
          {tx.amount === null && (
            <span className="tx-badge">{tx.type === 'swipe' ? 'Swipe' : 'GET&GO'}</span>
          )}
        </div>
      ))}
    </div>
  );
}

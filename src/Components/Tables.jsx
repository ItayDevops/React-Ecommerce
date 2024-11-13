import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const Tables = ({ data, columns }) => {
  const users = data || useSelector((state) => state.users.users);

  const renderProductsBought = (products) => {
    if (!Array.isArray(products) || products.length === 0) {
      return 'N/A'; 
    }

    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '4px' }}>Product ID</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Quantity</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id || index}>
              <td style={{ border: '1px solid black', padding: '4px' }}>{product.id}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{product.name}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{product.qty}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{product.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="update-form">
      <table style={{ margin: '10px', padding: '10px', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            {columns.map((column) => (
              <th key={column.key} style={{ border: '1px solid black', padding: '8px' }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id || index}>
              {columns.map((column) => (
                <td key={column.key} style={{ border: '1px solid black', padding: '8px', margin:'8px',backgroundColor: '#f2f2f2',textAlign:'center' }}>
                  {column.key === 'productsBought'
                    ? renderProductsBought(user[column.key])
                    : user[column.key] || 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Tables.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Tables;

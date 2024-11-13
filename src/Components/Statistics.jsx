import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useSelector } from 'react-redux';
import { Select, MenuItem, FormControl, Box, Typography } from '@mui/material';

const Statistics = () => {
  const users = useSelector((state) => state.users.users);
  const [selectedUser, setSelectedUser] = React.useState(users[0]?.name || '');

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const selectedUserData = users.find((user) => user.name === selectedUser);

  const productQuantities = users.reduce((acc, user) => {
    user.productsBought.forEach(({ name, qty }) => {
      const quantity = Number(qty);
      if (isNaN(quantity)) {
        console.error(`Invalid quantity for product "${name}": ${qty}`);
        return;
      }

      if (acc[name]) {
        acc[name] += quantity;
      } else {
        acc[name] = quantity;
      }
    });
    return acc;
  }, {});

  const pieData = Object.entries(productQuantities).map(([label, value]) => ({
    label,
    value,
  }));

  const barChartData = selectedUserData
    ? selectedUserData.productsBought.map(({ name, qty }) => ({
        label: name,
        value: qty,
      }))
    : [];

  const size = {
    width: 400,
    height: 200,
  };

  const pieColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <PieChart
          series={[
            {
              arcLabel: (item) => `${item.label} (${item.value})`,
              arcLabelMinAngle: 45,
              data: pieData,
              color: (item, index) => pieColors[index % pieColors.length],
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontWeight: 'bold',
            },
          }}
          {...size}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 2 }}>
        <Typography variant="h6">Product Quantity Per Customer</Typography>
        
        <FormControl sx={{ minWidth: 120, marginBottom: '20px' }}>
          <Typography variant="subtitle1">Sort By Customer</Typography>
          <Select
            value={selectedUser}
            onChange={handleUserChange}
            sx={{ fontSize: '14px', padding: '5px' }}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.name} sx={{ fontSize: '12px' }}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* BarChart */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <BarChart
          xAxis={[{ scaleType: 'band', data: barChartData.map((d) => d.label) }]}
          series={[
            {
              label: selectedUser,
              data: barChartData.map((d) => d.value),
            },
          ]}
          width={300}
          height={400}
        />
      </Box>
    </Box>
  );
};

export default Statistics;

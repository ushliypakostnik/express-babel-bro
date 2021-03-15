import { ApiClient } from 'admin-bro';
// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
import { Box } from '@admin-bro/design-system';
import { useState, useEffect } from 'react';

const api = new ApiClient();

const Dashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    api.getDashboard().then((response) => {
      setData(response.data);
    });
  }, []);

  return (
    <Box variant="grey">
      <Box variant="white">{ data.header }</Box>
    </Box>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import './App.css';

import { Container } from 'react-bootstrap';

import Job from './Components/Job';

// Import API_Calls
import FetchJobs from './API_Calls/fetchJobs';

function App() {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const { jobs, loading, error } = FetchJobs(params, page);

  return (
    <Container>
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error! Please Refresh...</h1>}
      {jobs.map((job) => {
        return <Job key={job.id} job={job} />;
      })}
    </Container>
  );
}

export default App;

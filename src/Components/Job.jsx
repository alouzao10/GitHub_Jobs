import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

function Job(props) {
  const {
    title,
    company,
    created_at,
    type,
    location,
    how_to_apply,
    company_logo,
  } = props.job;
  return (
    <Card>
      <Card.Body>
        <div className='d-flex justify-content-between'>
          <div>
            <Card.Title>
              {title} -
              <span className='text-muted font-weight-light'> {company}</span>
            </Card.Title>
            <Card.Subtitle className='text-muted mb-2'>
              {new Date(created_at).toLocaleDateString()}
            </Card.Subtitle>
            <Badge variant='secondary' className='mr-2'>
              {type}
            </Badge>
            <Badge variant='primary'>{location}</Badge>
            <div style={{ wordBreak: 'break-all' }}>
              <ReactMarkdown source={how_to_apply}></ReactMarkdown>
            </div>
          </div>
          <img
            className='d-none d-md-block'
            height='50'
            src={company_logo}
            alt={company}
          />
        </div>
      </Card.Body>
    </Card>
  );
}

export default Job;

import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

interface Business {
  id: string;
  name: string;
  image_url: string;
  rating: number;
  review_count: number;
  price: string;
}

const SearchPage: React.FC = () => {
  const [term, setTerm] = useState<string>('');
  const [results, setResults] = useState<Business[]>([]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get<Business[]>(`http://localhost:4000/api/search?term=${term}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Container>
      <h1 className="my-4">Restaurant Search</h1>
      <Form onSubmit={handleSearch}>
        <Row>
          <Col md={10}>
            <Form.Group>
              <Form.Control 
                type="text" 
                placeholder="Restaurant name" 
                value={term}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button variant="primary" type="submit">Search</Button>
          </Col>
        </Row>
      </Form>
      
      <Row className="mt-4">
        {results.map((business: Business) => (
          <Col md={4} key={business.id} className="mb-4">
            <Card className="h-100">
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <Card.Img 
                  variant="top" 
                  src={business.image_url} 
                  style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title>{business.name}</Card.Title>
                <Card.Text>
                  Rating: {business.rating}<br />
                  Reviews: {business.review_count}<br />
                  Price: {business.price}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SearchPage;
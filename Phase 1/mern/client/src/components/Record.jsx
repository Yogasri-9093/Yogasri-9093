// src/components/Records.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('/api/records');
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    const searchRecords = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get('/api/records/search', {
          params: { q: searchQuery }
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching records:', error);
      }
    };

    searchRecords();
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <h1>Records</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search records..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <ul>
        {(searchQuery ? searchResults : records).map((record) => (
          <li key={record._id}>
            {record.name} - {record.position}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Records;
/*
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Records() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecords() {
      try {
        const response = await fetch('http://localhost:5050/record');
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    }
    fetchRecords();
  }, []);

  useEffect(() => {
    async function searchRecords() {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5050/record/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error searching records:', error);
      }
    }
    searchRecords();
  }, [searchQuery]);

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
  }

  function handleRecordClick(id) {
    navigate(`/record/${id}`);
  }

  return (
    <div>
      <h2>Employee Records</h2>
      <input
        type="text"
        placeholder="Search records..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <ul>
        {(searchQuery ? searchResults : records).map(record => (
          <li key={record._id} onClick={() => handleRecordClick(record._id)}>
            {record.name} - {record.position}
          </li>
        ))}
      </ul>
    </div>
  );
}
*/

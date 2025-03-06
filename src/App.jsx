import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const [clients, setClients] = useState({});
  const [projects, setProjects] = useState([]);

  const [isHighlighted, setIsHighlighted] = useState(false);

  // List of states
  const states = [
    'New South Wales',
    'Victoria',
    'South Australia',
    'Queensland',
    'Western Australia',
    'Tasmania',
    'Northern Territory',
    'ACT',
  ];

  // Multi-level navigation data
  const navigation = {
    'parent-id-1': ['sub-navigation1', 'sub-navigation2'],
    'parent-id-2': ['sub-navigation1', 'sub-navigation2'],
    'parent-id-3': ['sub-navigation1', 'sub-navigation2'],
  };

  // Fetch clients and projects data on component mount
  useEffect(() => {
    // Fetch clients with projects
    axios.get('http://127.0.0.1:8000/api/clients-with-projects')
      .then(response => {
        const groupedData = groupClientsByProjects(response.data);
        setClients(groupedData);
      })
      .catch(error => {
        console.error('Error fetching clients data:', error);
      });

    // Fetch projects with the number of clients
    axios.get('http://127.0.0.1:8000/api/projects-with-no-clients')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects data:', error);
      });
  }, []);

  // Function to group clients by projects
  const groupClientsByProjects = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      if (!groupedData[item.client_name]) {
        groupedData[item.client_name] = [];
      }
      groupedData[item.client_name].push(item.project_name);
    });

    return groupedData;
  };

  // Function to handle button click
  const handleClick = () => {
    setIsHighlighted(true); // Set the state to highlight the list items
  };

  return (
    <div>
      {/* Clients and Their Purchased Projects */}
      <h1>Clients and Their Purchased Projects</h1>
      {Object.keys(clients).map((clientName) => (
        <div key={clientName}>
          <h2>{clientName}</h2>
          <ul>
            {clients[clientName].map((projectName, index) => (
              <li key={index}>{projectName}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* Projects and Their Number of Clients */}
      <h1>Projects and Their Number of Clients</h1>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>
            {project.project_name}: {project.number_of_clients} clients
          </li>
        ))}
      </ul>

      {/* List of States */}
      <h1>States</h1>
      <ul className="states">
        {states.map((state, index) => (
          <li
            key={index}
            style={{ color: isHighlighted ? 'red' : 'black' }} // Change color based on state
          >
            {state}
          </li>
        ))}
      </ul>

      {/* Multi-Level Navigation */}
      <h1>Navigation</h1>
      <ul>
        {Object.entries(navigation).map(([parentId, subItems]) => (
          <li key={parentId}>
            <span>{parentId}</span>
            <ul>
              {subItems.map((subItem, index) => (
                <li key={index}>{subItem}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}

export default App;

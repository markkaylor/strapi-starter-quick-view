import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [starters, setStarters] = useState([])


  function getIssueCountClass(issueCount) {
    if (issueCount < 5) {
      return 'success'
    }

    if (issueCount < 10) {
      return 'warning'
    }

    return 'danger'
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        'https://api.github.com/orgs/strapi/repos',
        {
          params: {
            per_page: 100,
          },
        }
      )
      const filteredSortedData = data
        .filter(
          (repo) => repo.name.startsWith('strapi-starter') && !repo.archived
        )
        .map((repo) => repo)
        .sort((a, b) => (a.open_issues_count < b.open_issues_count ? 1 : -1))

      setStarters(filteredSortedData)
    }
    fetchData()
  }, [])

  return (
    <div className="App">
      <h1>Starter Issues</h1>
      <div className="starter-grid">
        {starters &&
          starters.map((starter) => {
            const starterName = starter.name.split('-').slice(2).join(' ')
            return (
              <div className="starter-card" key={starter.id}>
                <h3>{starterName} </h3>
                <div className="starter-issues-container">
                  <p>Issues + PRs:</p>
                  <p className={`starter-issue-count ${getIssueCountClass(starter.open_issues_count)}`}>
                    {starter.open_issues_count}
                  </p>
                </div>
                <div className="link-container">
                  <a
                    className="starter-link"
                    target="_blank"
                    rel="noreferrer"
                    href={starter.html_url}
                  >
                    Go to repo
                  </a>
                  <a
                    className="starter-link"
                    target="_blank"
                    rel="noreferrer"
                    href={`${starter.html_url}/issues`}
                  >
                    Go to issues
                  </a>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default App

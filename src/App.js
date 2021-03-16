import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [repos, setRepos] = useState({ starters: [], templates: [] })
  const [view, setView] = useState('starters')

  function getIssueCountClass(issueCount) {
    if (issueCount < 5) {
      return 'success'
    }

    if (issueCount < 10) {
      return 'warning'
    }

    return 'danger'
  }

  function handleClick(viewUpdate) {
    setView(viewUpdate)
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
      const filteredSortedStarters = data
        .filter(
          (repo) => repo.name.startsWith('strapi-starter') && !repo.archived
        )
        .map((repo) => repo)
        .sort((a, b) => (a.open_issues_count < b.open_issues_count ? 1 : -1))

      const filteredSortedTemplates = data
        .filter(
          (repo) => repo.name.startsWith('strapi-template') && !repo.archived
        )
        .map((repo) => repo)
        .sort((a, b) => (a.open_issues_count < b.open_issues_count ? 1 : -1))

      setRepos({
        starters: filteredSortedStarters,
        templates: filteredSortedTemplates,
      })
    }
    fetchData()
  }, [])

  return (
    <div className="App">
      <h1 className="uppercase">{view} Issues</h1>
      <div className="issue-button-container">
        <button
          className="issue-button-link"
          onClick={() => handleClick('starters')}
        >
          Starters
        </button>
        <button
          className="issue-button-link"
          onClick={() => handleClick('templates')}
        >
          Templates
        </button>
      </div>
      <div className="issue-grid">
        {repos[view] &&
          repos[view].map((issue) => {
            const issueName = issue.name.split('-').slice(2).join(' ')
            return (
              <div className="issue-card" key={issue.id}>
                <h3>{issueName} </h3>
                <div className="issues-container">
                  <p>Issues + PRs:</p>
                  <p
                    className={`issue-count ${getIssueCountClass(
                      issue.open_issues_count
                    )}`}
                  >
                    {issue.open_issues_count}
                  </p>
                </div>
                <div className="link-container">
                  <a
                    className="issue-link"
                    target="_blank"
                    rel="noreferrer"
                    href={issue.html_url}
                  >
                    Go to repo
                  </a>
                  <a
                    className="issue-link"
                    target="_blank"
                    rel="noreferrer"
                    href={`${issue.html_url}/issues`}
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

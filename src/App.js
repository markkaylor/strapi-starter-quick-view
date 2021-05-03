import axios from "axios"
import { useEffect, useState } from "react"
import ownerData from "./owners.json"
import "./App.css"

function App() {
  const [repos, setRepos] = useState({ starters: [], templates: [] })
  const [owners] = useState(ownerData.map((owner) => owner))
  const [view, setView] = useState("starters")

  function getIssueCountClass(issueCount) {
    if (issueCount < 5) {
      return "success"
    }

    if (issueCount < 10) {
      return "warning"
    }

    return "danger"
  }

  function handleClick(viewUpdate) {
    setView(viewUpdate)
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        "https://api.github.com/orgs/strapi/repos",
        {
          params: {
            per_page: 100,
          },
        }
      )

      const filteredSortedStarters = data
        .filter(
          (repo) => repo.name.startsWith("strapi-starter") && !repo.archived
        )
        .map((repo) => repo)
        .sort((a, b) => (a.open_issues_count < b.open_issues_count ? 1 : -1))

      const filteredSortedTemplates = data
        .filter(
          (repo) => repo.name.startsWith("strapi-template") && !repo.archived
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

  function getOwner(url) {
    return owners.find((owner) => owner.Link === url)
  }

  console.log(repos)

  return (
    <div className="App">
      <h1 className="uppercase">{view} Issues</h1>
      <div className="repo-button-container">
        <button
          className="repo-button-link"
          onClick={() => handleClick("starters")}
        >
          Starters
        </button>
        <button
          className="repo-button-link"
          onClick={() => handleClick("templates")}
        >
          Templates
        </button>
      </div>
      <div className="repo-grid">
        {repos[view] &&
          repos[view].map((repo) => {
            const owner = getOwner(repo.html_url)

            const repoName = repo.name.split("-").slice(2).join(" ")
            return (
              <div className="repo-card" key={repo.id}>
                <h3>{repoName} </h3>
                <div className="repos-container">
                  <p>Owner: </p>
                  <p>{owner && owner.Owner}</p>
                </div>
                <div className="repos-container">
                  <p>Issues + PRs:</p>
                  <p
                    className={`issue-count ${getIssueCountClass(
                      repo.open_issues_count
                    )}`}
                  >
                    {repo.open_issues_count}
                  </p>
                </div>
                <div className="link-container">
                  <a
                    className="repo-link"
                    target="_blank"
                    rel="noreferrer"
                    href={repo.html_url}
                  >
                    Go to repo
                  </a>
                  <a
                    className="repo-link"
                    target="_blank"
                    rel="noreferrer"
                    href={`${repo.html_url}/issues`}
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

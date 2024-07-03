require('dotenv').config();

const axios = require('axios')
const express = require('express')
const _ = require('lodash');

const app = express()
app.use(express.json())

const bearerToken = process.env.GITHUB_BEARER_TOKEN;
const owner = 'ejchester';
const repo = 'commentary';

const getIssues = async () => {
  const { data } = await axios({
    url: `https://api.github.com/repos/${owner}/${repo}/issues`,
    method: 'get',
    responseType: 'json',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${bearerToken}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  
  return _.map(data, (x) => {
    return {
      url: x.html_url,
      title: x.title,
      description: x.body
    }
  });
}

const createIssue = async (title, description) => {
  const { data } = await axios({
    url: `https://api.github.com/repos/${owner}/${repo}/issues`,
    method: 'post',
    responseType: 'json',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${bearerToken}`,
      'X-GitHub-Api-Version': '2022-11-28'
    },
    data: { title, description }
  })

  return { 
    url: data.html_url
  };
}

app.get('/issues', async (req, res) => {
  const issues = await getIssues();
  res.setHeader('Content-Type', 'application/json');
  res.send(issues);
});

app.post('/issue', async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const issue = await createIssue(title, description);
  res.setHeader('Content-Type', 'application/json');
  res.send(issue);
})

app.listen(3000, () => {
  console.log('app started on port 3000');
});

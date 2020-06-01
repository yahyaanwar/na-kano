export default [
  {
    order: 3,
    title: 'a task',
    description: 'to doing a task',
    workspace: 'a workspace', // false mean apper to any workspace
    created_on: '2020-05-31T23:56',
    edited_on: '2020-05-31T23:56', // or false when not edited
    completed_on: '2020-05-01T00:39', // for statuses, false when still active
    reset: 'monthly', // false, daily, weekly, x days, monthly
    tags: ['example', 'todo task'], // for filtering
  },
  {
    order: 3,
    title: 'a task',
    description: 'to doing a task',
    workspace: 'a workspace', // false mean apper to any workspace
    created_on: '2020-05-31T23:56',
    edited_on: '2020-05-31T23:56', // or false when not edited
    completed_on: '2020-05-29T00:50', // for statuses, false when still active
    reset: '3 days', // false, daily, weekly, x days, monthly
    tags: ['example', 'todo task'], // for filtering
  },
]
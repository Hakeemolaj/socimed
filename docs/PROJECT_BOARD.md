# Project Board Setup

This document outlines how to set up and use a project board for the Socimed repository.

## Creating a Project Board

1. Go to your GitHub repository at https://github.com/Hakeemolaj/socimed
2. Click on "Projects" > "New project"
3. Select "Board" as the template
4. Name it "Socimed Development"
5. Add a description: "Track development tasks, issues, and features for Socimed"
6. Click "Create"

## Setting Up Columns

After creating the project, set up the following columns:

1. **To Do**
   - Description: "Tasks that are planned but not yet started"
   - Add automation: "Move newly added items here"

2. **In Progress**
   - Description: "Tasks that are currently being worked on"
   - Add automation: "Move items with open pull requests here"

3. **Review**
   - Description: "Tasks that are completed and awaiting review"
   - Add automation: "Move items with pull requests ready for review here"

4. **Done**
   - Description: "Tasks that are completed and merged"
   - Add automation: "Move items with closed pull requests and merged changes here"

## Using the Project Board

### Adding Items to the Board

1. **From Issues**:
   - Create an issue in the repository
   - In the right sidebar, click "Projects" and select "Socimed Development"
   - The issue will automatically be added to the "To Do" column

2. **From Pull Requests**:
   - Create a pull request in the repository
   - In the right sidebar, click "Projects" and select "Socimed Development"
   - The PR will automatically be added to the appropriate column based on its status

3. **Directly on the Board**:
   - Click the "+" button in any column
   - Enter a title and description
   - Click "Add"

### Moving Items Between Columns

1. **Manually**:
   - Drag and drop items between columns as their status changes

2. **Automatically**:
   - Items will move automatically based on the automation rules set up for each column
   - For example, when a PR is opened for an issue, it will move to "In Progress"
   - When a PR is ready for review, it will move to "Review"
   - When a PR is merged, it will move to "Done"

## Best Practices

1. **Keep the Board Updated**:
   - Regularly review and update the status of items
   - Move items to the appropriate columns as their status changes

2. **Use Labels**:
   - Add labels to issues and PRs to categorize them (e.g., "bug", "feature", "documentation")
   - Filter the board by labels to focus on specific types of tasks

3. **Assign Owners**:
   - Assign team members to issues and PRs
   - Filter the board by assignee to see what each team member is working on

4. **Add Due Dates**:
   - Set due dates for important tasks
   - Sort the board by due date to prioritize work

5. **Regular Reviews**:
   - Hold regular meetings to review the board
   - Discuss progress, blockers, and next steps

## Benefits

- Provides a visual overview of the project status
- Helps track progress and identify bottlenecks
- Facilitates collaboration and coordination among team members
- Ensures important tasks don't get forgotten
- Creates transparency about what everyone is working on

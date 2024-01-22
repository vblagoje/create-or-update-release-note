# create-or-update-release-note
GitHub Action to create or update a Reno release note for a pull request


## Description
The `create-or-update-release-note` GitHub Action automates creating or updating a Reno release note for a pull request. This action determines whether a new release note needs to be created or an existing one should be updated based on the provided note name.

## Inputs

### `note-name`
**Required** Name of the release note. This should be just the name, without a hash suffix and the `.yml` file extension.

### `note-content`
**Required** Content of the release note.

## How it Works
- If the `note-name` corresponds to an existing note in the `releasenotes/notes/` directory, the action updates the existing note with the provided `note-content`.
- If the `note-name` does not correspond to an existing note, the action creates a new release note with the specified `note-content`.

## Example Usage
Below is an example of how to use the `create-or-update-release-note` action in your workflow:

```yaml
name: Update Release Note

on: [pull_request]

jobs:
  update-release-note:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Repository
      uses: actions/checkout@v2

    - name: Create or Update Release Note
      uses: vblagoje/create-or-update-release-note@v1
      with:
        note-name: 'example-note-name'
        note-content: 'This is the content of the release note.'
```

In this example, the action is triggered on a pull request event. It checks out the repository and then either creates or updates a release note based on the provided `note-name` and `note-content`.

## Contributing
Contributions to the `create-or-update-release-note` action are welcome. Feel free to submit pull requests or create issues for bug reports and feature requests.

## License
This project is licensed under [MIT](LICENSE).
```

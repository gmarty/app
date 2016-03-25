/* global React */

export default class ThemesListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enabled: props.enabled
    };

    this.foxbox = props.foxbox;
  }

  /**
   * Activate or deactivate a recipe.
   *
   * @param {number} id
   * @param {SyntheticEvent} evt
   */
  handleOnChange(id, evt) {
    const value = evt.target.checked;

    this.foxbox.recipes.toggle(id, value)
      .then(() => {
        this.setState({ enabled: value });
      })
      .catch(console.error.bind(console));
  }

  /**
   * Delete a recipe.
   *
   * @param {number} id
   */
  handleOnDelete(id) {
    this.foxbox.recipes.remove(id)
      .then(themes => {
        this.setState({ themes });
      })
      .catch(console.error.bind(console));
  }

  render() {
    let className = 'themes-list__item';
    if (!this.props.theme.enabled) {
      className += ' themes-list__item--deactivated';
    }

    return (
      <li className={className}>
        <input className="themes-list__toggle" type="checkbox"
               checked={this.props.theme.enabled}
               onChange={this.handleOnChange.bind(this, this.props.theme.id)}/>
        <span className="themes-list__name">{this.props.theme.name}</span>
        <button className="themes-list__remove"
                onClick={this.handleOnDelete.bind(this, this.props.theme.id)}>❌
        </button>
      </li>
    );
  }
}

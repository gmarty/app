/* global React */

import NavigationMenu from 'js/views/navigation-menu';
import ThemesListItem from 'js/views/themes-list-item';

export default class Themes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      themes: []
    };

    this.foxbox = props.foxbox;
  }

  componentDidMount() {
    this.foxbox.recipes.getAll()
      .then(themes => {
        this.setState({ themes });
      })
      .catch(console.error.bind(console));
  }

  render() {
    const themeItems = this.state.themes.map(theme => (
      <ThemesListItem key={theme.id} theme={theme} foxbox={this.foxbox}/>
    ));

    return (
      <div className="app-view">
        <header className="app-view__header">
          <h1>Recipes</h1>
          <a href="#themes/new" className="themes__new-link">
            <img className="app-view__action-icon"
                 src="css/icons/plus.svg"
                 alt="Add a recipe"/>
          </a>
        </header>
        <section className="app-view__body themes">
          <ul className="themes-list">{themeItems}</ul>
        </section>
        <footer className="app-view__footer">
          <NavigationMenu foxbox={this.foxbox}/>
        </footer>
      </div>
    );
  }
}

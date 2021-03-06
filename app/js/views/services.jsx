/* global React */

import UserLogoutButton from 'js/views/user-logout-button';
import FooterMenu from 'js/views/footer-menu';
import ServicesList from 'js/views/services-list';
import Modal from 'js/views/modal';

export default class Services extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],

      isModalVisible: false,
      title: '',
      body: ''
    };

    this.foxbox = props.foxbox;

    this.updateService = this.updateService.bind(this);
    this.updateServiceState = this.updateServiceState.bind(this);
  }

  componentDidMount() {
    this.foxbox.getServices()
      .then(services => {
        console.log(services);
        this.updateService(services);
      })
      .catch(console.error.bind(console));

    this.foxbox.getTags()
      .then(tags => {
        console.log(tags);
      })
      .catch(console.error.bind(console));

    this.foxbox.addEventListener('service-change', this.updateService);
    this.foxbox.addEventListener('service-state-change', this.updateServiceState);
  }

  componentWillUnmount() {
    this.foxbox.removeEventListener('service-change', this.updateService);
    this.foxbox.removeEventListener('service-state-change', this.updateServiceState);
  }

  updateService(services) {
    this.setState({ services: services });
  }

  updateServiceState(state) {
    // Find the index of the service which state has changed.
    const serviceId = this.state.services.findIndex(service => service.id === state.id);
    const services = this.state.services;

    // Update the new state.
    services[serviceId] = state;
    this.setState({ services: services });
  }

  dismissModal() {
    this.setState({ isModalVisible: false });
  }

  render() {
    return (
      <div>
        <header>
          <h1>My Home</h1>
          <UserLogoutButton foxbox={this.foxbox}/>
        </header>
        <h2>General</h2>
        <ServicesList services={this.state.services} foxbox={this.foxbox}/>
        <Modal visible={this.state.isModalVisible} title={this.state.title} body={this.state.body} dismiss={this.dismissModal.bind(this)}/>
        <FooterMenu/>
      </div>
    );
  }
}

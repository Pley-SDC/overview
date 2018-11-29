import React from 'react';
import styled from 'styled-components';
import Modal from 'react-responsive-modal';
import axios from 'axios';
import ModalView from './ModalView.jsx';
import Address from './Address.jsx';

const Wrapper = styled.div`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: row;
  height: 480px;
  justify-content: center;
  div {
    &.container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }
    &.buttons {
      display: flex;
      height: 100%;
      flex-direction: row;
      align-self: flex-end;
    }
    &.pictures {
      display: flex;
      flex-direction: row;
      align-self: flex-end;
    }
    &.background {
      position: absolute;
      height: 420px;
      width: 100%;
      z-index: -1000;
      background: #f5f5f5;
    }
  }
  h2 {
    font-size: 18px;
    font-weight: normal;
    margin-left: 5px;
  }
  button {
    display: flex;
    cursor: pointer;
    margin-top: 30px;
    font-weight: bold;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #666666;
    align-self: center;
    align-items: center;
    border: 1px solid #e6e6e6;
    background: #FEFEFE;
    font-size: 14px;
    height: 30px;
    border-radius: 3px;
    filter: drop-shadow(0px 0.5px 1px #3f4247);
    margin-bottom: 120px;
    svg {
      fill: #666666;
      height: 18px;
      width: 18px;
      padding: 5px 3px 5px 5px;
      &.save {
        padding-bottom: 0px;
      }
    }
    &.review {
      background: #d32323;
      color: white;
      height: 38px;
      border: solid 0.5px #333333;
      margin-right: 15px;
      svg {
        fill: white;
        width: 25px;
        height: 25px;
      }
    }
  }
  img {
    cursor: pointer;
    filter: drop-shadow(5px -0.5px 3px #3f4247);
    align-self: flex-end;
    height: 220px;
    width: 220px;
    object-fit: cover;
    margin-bottom: 60px;
    transition: all .3s ease-in-out;
    &.focused {
      margin-bottom: 40px;
      height: 250px;
      width: 250px;
      z-index: 50;
    }
  }
  span {
    margin-bottom: 2px;
    margin-right: 10px;
    &.save {
      margin-bottom: 0px;
    }
  }
`;

const AddressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  h1 {
    position: absolute;
  }
  img {
    &.address-stars {
      width: 100px;
      padding-top: 70px;
      object-fit: contain;
      margin-bottom: 0;
      align-self: flex-start;
    }
  }
`;

class Pictures extends React.Component {
  static fetchData(id, callback) {
    axios.get(`${process.env.OVERVIEW_URL}/overview/restaurants/${id}`)
      .then((response) => {
        callback(response.data);
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      focused: 1,
      show: false,
      currentModalUrl: '',
      currentModalId: 0,
      images: [],
      restaurant: {
        name: '',
        address: '',
        phone: '',
        website: '',
        cost: '',
        googleMap: '',
      },
    };
    this.randomStars = Math.floor(Math.random() * Math.floor(9)) + 1;
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handlePictureEnter = this.handlePictureEnter.bind(this);
    this.handlePictureLeave = this.handlePictureLeave.bind(this);
  }

  componentDidMount() {
    let id = window.location.pathname.slice(1);
    if (!id) id = Math.floor(Math.random() * 10000000 + 1);
    Pictures.fetchData(id, (data) => {
      this.parseData(data);
    });
  }

  handlePictureEnter(e, num) {
    this.setState({ focused: num });
  }

  handlePictureLeave() {
    this.setState({ focused: 1 });
  }

  showModal(e) {
    const { images } = this.state;
    const display = e.target.getAttribute('src');
    const modalId = images.indexOf(display);
    this.setState({
      show: true,
      currentModalUrl: display,
      currentModalId: modalId,
    });
  }

  hideModal() {
    this.setState({ show: false });
  }

  parseData(restaurantData) {
    let imgURLs = [];
    let costString = '';
    imgURLs = restaurantData.images.map(imageData => imageData.image);
    for (let i = 0; i < restaurantData.cost; i += 1) {
      costString += '$';
    }
    this.setState({
      images: imgURLs,
      restaurant: {
        address: restaurantData.address,
        name: restaurantData.name,
        phone: restaurantData.phone,
        website: restaurantData.website,
        googleMap: restaurantData.googleMap,
        cost: costString,
      },
    });
  }

  handleNextButton() {
    const { currentModalId, images } = this.state;
    let nextImageId = currentModalId + 1;
    const maxLength = images.length - 1;
    if (nextImageId > maxLength) {
      nextImageId -= 1;
    }
    this.setState({
      currentModalUrl: images[nextImageId],
      currentModalId: nextImageId,
    });
  }

  handleBackButton() {
    const { currentModalId, images } = this.state;
    let prevImageId = currentModalId - 1;
    if (prevImageId < 0) {
      prevImageId += 1;
    }
    this.setState({
      currentModalUrl: images[prevImageId],
      currentModalId: prevImageId,
    });
  }

  render() {
    const {
      images,
      show,
      currentModalUrl,
      focused,
      restaurant: {
        address,
        name,
        phone,
        website,
        googleMap,
        cost,
      },
    } = this.state;

    return (

      <Wrapper>
        <AddressWrapper>
          <h1>{name}</h1>
          <img className="address-stars" src={`https://s3-us-west-1.amazonaws.com/hrfrontendcapstone/regular_${this.randomStars}.png`} />
          <h2>{cost}</h2>
          <div>
            <Address
              address={address}
              phone={phone}
              website={website}
              googleMap={googleMap}
            />
          </div>
        </AddressWrapper>
        <div className="container">
          <div className="buttons">
            <button type="button" className="review">
              <svg>
                <path d="M12 1.5l2.61 6.727 6.89.53-5.278 4.688 1.65 7.055L12 16.67 6.13 20.5l1.648-7.055L2.5 8.757l6.89-.53L12 1.5z" />
              </svg>
              Write a Review
            </button>
            <button type="button">
              <svg>
                <path d="M15 15H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2zM9 4.75a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5zM11 10h-1v1a1 1 0 0 1-2 0v-1H7a1 1 0 0 1 0-2h1V7a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2z" />
              </svg>
              <span>Add a Photo</span>
            </button>
            <button type="button">
              <svg>
                <path d="M17.714 6.43L13 10.356v-3.03c-1 0-5.097 1.47-6.286 3.62.274-3.08 4.286-5.5 6.286-5.5V2.5l4.714 3.93zM3 4v10h11v-2.5l1-1V15H2V3h8.5l-1 1H3z" />
              </svg>
              <span>Share</span>
            </button>
            <button type="button">
              <svg className="save">
                <path d="M9 1H5a2 2 0 0 0-2 2v10l4-3 4 3V3a2 2 0 0 0-2-2z" />
              </svg>
              <span className="save">Save</span>
            </button>
          </div>
          <div className="pictures">
            {images.slice(0, 3).map((image, i) => {
              if (i === 1) {
                return (
                  <img
                    className={focused === i ? 'focused' : ''}
                    src={image}
                    onClick={this.showModal}
                    onMouseEnter={e => this.handlePictureEnter(e, i)}
                    onMouseLeave={this.handlePictureLeave}
                  />
                );
              }
              return (
                <img
                  className={focused === i ? 'focused' : ''}
                  src={image}
                  onClick={this.showModal}
                  onMouseEnter={e => this.handlePictureEnter(e, i)}
                  onMouseLeave={this.handlePictureLeave}
                />
              );
            })}
          </div>
        </div>
        <div className="background" />
        <Modal open={show} onClose={this.hideModal} center>
          <ModalView
            picture={currentModalUrl}
            handleNextButton={this.handleNextButton}
            handleBackButton={this.handleBackButton}
          />
        </Modal>
      </Wrapper>

    );
  }
}

export default Pictures;

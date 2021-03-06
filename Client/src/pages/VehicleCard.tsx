import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonActionSheet, useIonModal } from "@ionic/react"
import { arrowForwardOutline, arrowUndoOutline, checkmarkCircle, closeCircleOutline, heart, heartOutline, removeCircleOutline, star, starOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { curr_priv, curr_pswd, curr_user, email_verified, setRefreshQuery } from "../components/StorageService";

import './Main.css';
import BuyPage from "./BuyPage";
import RentPage from "./RentPage";

// Vehicle information component
const VehicleCard: React.FC<{ mainRef: any; id: number; onDismiss: () => void }> = ({ mainRef, id, onDismiss }) => {
  // React component reference
  const pageRef = useRef();

  // Vehicle information state variables
  const [vehicle, setVehicle] = useState<any>({});
  const [favorites, setFavorites] = useState<Array<any>>([]);
  const [update, setUpdate] = useState(false);
  const [ratings, setRatings] = useState<Array<any>>([]);
  const [comments, setComments] = useState<Array<any>>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [replyComment, setReplyComment] = useState<any>({});
  const [requestsListBuyer, setRequestsListBuyer] = useState<Array<any>>([]);
  const [requestsListSeller, setRequestsListSeller] = useState<Array<any>>([]);

  // Gets a list of a user's favorite vehicles
  const getFavorites = async () => {
    await fetch('https://api.kianm.net/index.php/account/favorites', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        setFavorites(result)
      })
  }

  // Adds a vehicle to a user's favorites
  const addFavorite = ($id: number) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/account/addFavorite', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"id":' + $id + '}'
    })
      .then(() => setUpdate(true))
  }

  // Removes a vehicle from a user's favorites
  const removeFavorite = ($id: number) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/account/removeFavorite', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"id":' + $id + '}'
    })
      .then(() => setUpdate(true))
  }

  // Gets a list of comments on the vehicle
  const getComments = async () => {
    await fetch('https://api.kianm.net/index.php/comments/list', {
      method: 'POST',
      mode: 'cors',
      body: '{"vehicle_id":' + id + '}'
    })
      .then(e => e.json())
      .then(result => {
        setComments(result)
      })
  }

  // Gets the comment that was replied to
  const getRepliedTo = async (comment_id: number) => {
    return await fetch('https://api.kianm.net/index.php/comments/get', {
      method: 'POST',
      mode: 'cors',
      body: '{"id":' + comment_id + '}'
    })
  }

  // Submits a comment on a vehicle
  const addComment = (vehicle_id: number, content: string, replied_to?: number) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/comments/add', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"vehicle_id":' + vehicle_id + ',"content":"' + content + (replied_to === undefined ? '"' : '","replied_to":' + replied_to) + '}'
    })
      .then(() => setUpdate(true))
  }

  // Removes a comment from a vehicle
  const removeComment = ($id: number) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/comments/remove', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"id":' + $id + '}'
    })
      .then(() => setUpdate(true))
  }

  // Deletes a vehicle from the database
  const removeVehicle = ($id: number) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/vehicles/remove', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"id":"' + $id + '"}'
    })
      .then(e => e.json())
      .then(result => {
        if (result.removed === true) {
          setUpdate(true);
        }
      })
  }

  // Gets the vehicle information
  const getVehicle = () => {
    if (curr_priv >= 2) {
      fetch('https://api.kianm.net/index.php/vehicles/get', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
          'Content-Type': 'application/json'
        },
        body: '{"id":' + id + '}'
      })
        .then(e => e.json())
        .then(result => {
          if (curr_user !== '') {
            getFavorites();
            getRatings();
            getRequests()
          }
          setVehicle(result[0]);
        })
    } else {
      fetch('https://api.kianm.net/index.php/vehicles/get', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{"id":' + id + '}'
      })
        .then(e => e.json())
        .then(result => {
          if (curr_user !== '') {
            getFavorites();
            getRatings();
            getRequests()
          }
          setVehicle(result[0]);
        })
    }
  }

  // Gets a list of the rating a user has given
  const getRatings = async () => {
    await fetch('https://api.kianm.net/index.php/account/ratings', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        setRatings(result)
      })
  }

  // Adds a rating to the vehicle
  const submitRating = async (id: number, rating: number) => {
    setRefreshQuery(true);
    await fetch('https://api.kianm.net/index.php/vehicles/submitRating', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      },
      body: JSON.stringify({
        "id": id,
        "rating": rating
      })
    })
      .then(e => setUpdate(true))
  }

  // Removes a rating from a vehicle
  const removeRating = async (id: number) => {
    setRefreshQuery(true);
    await fetch('https://api.kianm.net/index.php/vehicles/removeRating', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      },
      body: JSON.stringify({
        "id": id
      })
    })
      .then(e => setUpdate(true))
  }

  // Gets the buy/rent requests made on the vehicle
  const getRequests = () => {
    fetch('https://api.kianm.net/index.php/payment/listBuyer', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        setRequestsListBuyer(result);
      })

    fetch('https://api.kianm.net/index.php/payment/listSeller', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        setRequestsListSeller(result);
      })
  }

  // Cancels a request made on a vehicle
  const cancelRequest = ($vehicle_id: number, buyer: string, seller: string) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/payment/cancel', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      },
      body: '{"vehicle_id":' + $vehicle_id + ',"buyer":"' + buyer + '","seller":"' + seller + '"}'
    })
      .then(() => { getRequests() })
  }

  // Runs on update state change, refreshes a vehicles information
  useEffect(() => {
    if (curr_user !== '' && curr_pswd !== '') {
      getFavorites();
      getRatings();
      getRequests();
    }
    getComments();
    getVehicle();
    setUpdate(false);
    // eslint-disable-next-line
  }, [update])

  // Deletion alert controller
  const [presentRemove, dismissRemove] = useIonActionSheet();
  // Presents a delete alert for confirmation
  const handlePresentRemove = (vehicle_id: number) => {
    presentRemove({
      buttons: [
        {
          text: "Remove",
          handler: () => removeVehicle(vehicle_id)
        },
        { text: "Cancel" }
      ],
      header: "Remove vehicle?",
      mode: "ios"
    });
  }

  // Presents rent modal
  const handlePresentRent = () => {
    presentRent({
      mode: 'ios',
      swipeToClose: true,
      presentingElement: pageRef.current
    });
  };
  // Dismisses rent modal
  const handleDismissRent = () => {
    dismissRent();
    setUpdate(true);
  };
  // Rent modal controller
  const [presentRent, dismissRent] = useIonModal(RentPage, {
    vehicle: vehicle,
    onDismiss: handleDismissRent
  })

  // Presents buy modal
  const handlePresentBuy = () => {
    presentBuy({
      mode: 'ios',
      swipeToClose: true,
      presentingElement: pageRef.current
    });
  };
  // Dismisses buy modal
  const handleDismissBuy = () => {
    dismissBuy();
    setUpdate(true);
  };
  // Buy modal controller
  const [presentBuy, dismissBuy] = useIonModal(BuyPage, {
    vehicle: vehicle,
    onDismiss: handleDismissBuy
  })

  // Custom comment card component
  const CommentCard: React.FC<{ c: any }> = ({ c }) => {
    return (
      <IonRow key={c.id}>
        <IonCol size="2">
          <IonLabel color="primary"><h2>{c.user}</h2></IonLabel>
        </IonCol>
        <IonCol size={curr_priv >= 1 ? "7" : "9"}>
          <IonLabel color="tertiary" onClick={e => console.log("Clicked!")}>
            {c.replied_to !== null ? "Re: " + c.replied_to.user + " " : false}
          </IonLabel>
          <IonLabel class="ion-text-wrap">
            {c.content}
          </IonLabel>
        </IonCol>
        {curr_user !== '' ?
          <IonCol size={curr_priv >= 1 ? "3" : "1"}>
            <IonButtons>
              <IonButton size="small" onClick={e => setReplyComment(c)}>
                <IonIcon slot="icon-only" icon={arrowUndoOutline} />
              </IonButton>
              {curr_priv >= 1 ?
                <IonButton onClick={e => removeComment(c.id)}>
                  <IonIcon color="danger" slot="icon-only" icon={removeCircleOutline} />
                </IonButton>
                : false}
            </IonButtons>
          </IonCol> : false}
      </IonRow>
    );
  }

  // React components
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>Vehicle</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={() => onDismiss()}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {vehicle === undefined ?
        <IonContent forceOverscroll={false}>
          <IonCard mode="ios">
            <IonCardHeader>
              <IonCardTitle class='ion-text-center'>Vehicle not found</IonCardTitle>
            </IonCardHeader>
          </IonCard>
        </IonContent>
        :
        <IonContent forceOverscroll={false}>
          <IonCard key={vehicle.id} mode="ios">
            <IonCardHeader>
              <IonCardSubtitle>Vehicle</IonCardSubtitle>
              <IonCardTitle>{vehicle.model_year} {vehicle.make} {vehicle.model}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <Swiper slidesPerView='auto' className="swiper-main">
                {vehicle.images === undefined ? true : JSON.parse(vehicle.images).map((i: number) =>
                  <SwiperSlide key={i}>
                    <IonCard className='swiper-card' mode="ios">
                      <img alt={vehicle.id + '-' + i + '.jpg'} src={'https://api.kianm.net/files/vehicle_images/' + vehicle.id + '-' + i + '.jpg'} />
                    </IonCard>
                  </SwiperSlide>
                )}
              </Swiper>
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <IonLabel color="primary">Description:</IonLabel>
                  </IonCol>
                  <IonCol size="12">
                    <IonText class="ion-text-wrap">{vehicle.description}</IonText>
                  </IonCol>
                  <IonCol size="6">
                    <IonLabel color="primary">Price: </IonLabel>
                    <IonLabel>${Number(vehicle.price).toLocaleString('en-US')}</IonLabel>
                  </IonCol>
                  <IonCol size="6">
                    <IonLabel color="primary">Rent Price: </IonLabel>
                    <IonLabel>${Number(vehicle.rent_price).toLocaleString('en-US')}</IonLabel>
                  </IonCol>
                  <IonCol size="6">
                    <IonLabel color="primary">Mileage: </IonLabel>
                    <IonLabel>{Number(vehicle.mileage).toLocaleString('en-US')}</IonLabel>
                  </IonCol>
                  <IonCol size="6">
                    <IonLabel color="primary">Powertrain: </IonLabel>
                    <IonLabel>{vehicle.powertrain}</IonLabel>
                  </IonCol>
                  <IonCol size="6">
                    <IonLabel color="primary">Color: </IonLabel>
                    <IonLabel>{vehicle.color}</IonLabel>
                  </IonCol>
                  <IonCol size="6">
                    <IonLabel color="primary">Capacity: </IonLabel>
                    <IonLabel>{vehicle.capacity}</IonLabel>
                  </IonCol>
                  <IonCol size="6">
                    <IonLabel color="primary">User: </IonLabel>
                    <IonLabel>{vehicle.user}</IonLabel>
                  </IonCol>
                  <IonCol size="6">
                    <IonLabel color="primary">Transmission: </IonLabel>
                    <IonLabel>{vehicle.transmission}</IonLabel>
                  </IonCol>
                  <IonCol size="6">
                    <IonLabel color="primary">Vehicle Type: </IonLabel>
                    <IonLabel>{vehicle.vehicle_type}</IonLabel>
                  </IonCol>
                </IonRow>
                <IonRow>
                  {typeof (vehicle.vehicle_options) === "string" && vehicle.vehicle_options !== '' ? JSON.parse(vehicle.vehicle_options).map((o: string) =>
                    <IonCol key={o}>
                      <IonChip class="options-chip">
                        <IonIcon icon={checkmarkCircle} color='primary' />
                        <IonLabel>{o}</IonLabel>
                      </IonChip>
                    </IonCol>
                  ) : false}
                </IonRow>
                <IonRow>
                  <IonCol size={curr_user !== '' ? "7" : "12"}>
                    {ratings.find(r => r.id === vehicle.id) ?
                      <IonButtons class='center-buttons'>
                        <IonButton color="tertiary" onClick={e => { removeRating(vehicle.id); e.stopPropagation() }}>
                          <IonIcon icon={ratings.find(r => r.id === vehicle.id).rating >= .5 ? star : starOutline} />
                        </IonButton>
                        <IonButton color="tertiary" onClick={e => { removeRating(vehicle.id); e.stopPropagation() }}>
                          <IonIcon icon={ratings.find(r => r.id === vehicle.id).rating >= 1.5 ? star : starOutline} />
                        </IonButton>
                        <IonButton color="tertiary" onClick={e => { removeRating(vehicle.id); e.stopPropagation() }}>
                          <IonIcon icon={ratings.find(r => r.id === vehicle.id).rating >= 2.5 ? star : starOutline} />
                        </IonButton>
                        <IonButton color="tertiary" onClick={e => { removeRating(vehicle.id); e.stopPropagation() }}>
                          <IonIcon icon={ratings.find(r => r.id === vehicle.id).rating >= 3.5 ? star : starOutline} />
                        </IonButton>
                        <IonButton color="tertiary" onClick={e => { removeRating(vehicle.id); e.stopPropagation() }}>
                          <IonIcon icon={ratings.find(r => r.id === vehicle.id).rating >= 4.5 ? star : starOutline} />
                        </IonButton>
                      </IonButtons>
                      :
                      <IonButtons class='center-buttons'>
                        <IonButton disabled={curr_user === '' || email_verified === 'NO'} onClick={e => { submitRating(vehicle.id, 1); e.stopPropagation() }}>
                          <IonIcon icon={vehicle.rating >= .5 ? star : starOutline} />
                        </IonButton>
                        <IonButton disabled={curr_user === '' || email_verified === 'NO'} onClick={e => { submitRating(vehicle.id, 2); e.stopPropagation() }}>
                          <IonIcon icon={vehicle.rating >= 1.5 ? star : starOutline} />
                        </IonButton>
                        <IonButton disabled={curr_user === '' || email_verified === 'NO'} onClick={e => { submitRating(vehicle.id, 3); e.stopPropagation() }}>
                          <IonIcon icon={vehicle.rating >= 2.5 ? star : starOutline} />
                        </IonButton>
                        <IonButton disabled={curr_user === '' || email_verified === 'NO'} onClick={e => { submitRating(vehicle.id, 4); e.stopPropagation() }}>
                          <IonIcon icon={vehicle.rating >= 3.5 ? star : starOutline} />
                        </IonButton>
                        <IonButton disabled={curr_user === '' || email_verified === 'NO'} onClick={e => { submitRating(vehicle.id, 5); e.stopPropagation() }}>
                          <IonIcon icon={vehicle.rating >= 4.5 ? star : starOutline} />
                        </IonButton>
                      </IonButtons>
                    }
                  </IonCol>
                  {curr_user !== '' ?
                    <IonCol size="4">
                      <IonButtons class='center-buttons'>
                        <IonButton onClick={() => { favorites?.filter(e => e.id === vehicle.id).length === 1 ? removeFavorite(vehicle.id) : addFavorite(vehicle.id) }} size='small' fill='clear' color='primary'>
                          <IonIcon slot='icon-only' icon={favorites?.filter(e => e.id === vehicle.id).length === 1 ? heart : heartOutline} />
                        </IonButton>
                      </IonButtons>
                    </IonCol>
                    : false}
                  {curr_priv >= 1 ?
                    <IonCol size="1">
                      <IonButtons class='center-buttons'>
                        <IonButton size='small' fill='clear' color='danger' onClick={e => { handlePresentRemove(vehicle.id); e.stopPropagation() }}>
                          <IonIcon slot='icon-only' icon={removeCircleOutline} />
                        </IonButton>
                      </IonButtons>
                    </IonCol>
                    : false}
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Rent or Buy</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                {
                  vehicle.user === curr_user ?
                    <IonRow>
                      <IonCol class="center">
                        <IonLabel>This is your vehicle</IonLabel>
                      </IonCol>
                    </IonRow>
                    : email_verified !== "YES" ?
                      <IonRow>
                        <IonCol class="center">
                          <IonLabel class="ion-text-center">Please verify email to rent or buy...</IonLabel>
                        </IonCol>
                      </IonRow>
                      : false
                }
                {
                  requestsListBuyer.find(r => r.vehicle_id === vehicle.id) ?
                    <IonRow>
                      <IonCol class="center">
                        <IonLabel>You made a request on this vehicle</IonLabel>
                      </IonCol>
                      {requestsListBuyer.find(r => r.vehicle_id === vehicle.id).status === "Pending" ?
                        <IonCol>
                          <IonButton onClick={() => cancelRequest(vehicle.id, curr_user, vehicle.user)}>
                            <IonLabel>Cancel</IonLabel>
                          </IonButton>
                        </IonCol>
                        : false}
                    </IonRow>
                    :
                    <IonRow>
                      <IonCol>
                        <IonButton disabled={email_verified !== "YES" || vehicle.user === curr_user} color="primary" expand="block" onClick={() => handlePresentRent()}>
                          <IonLabel>Rent</IonLabel>
                        </IonButton>
                      </IonCol>
                      <IonCol>
                        <IonButton disabled={email_verified !== "YES" || vehicle.user === curr_user} color="tertiary" expand="block" onClick={() => handlePresentBuy()}>
                          <IonLabel>Buy</IonLabel>
                        </IonButton>
                      </IonCol>
                    </IonRow>
                }
              </IonGrid>
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Comments</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <IonItem disabled={curr_user === '' || email_verified !== "YES"} lines="full" class='input-item'>
                      {isNaN(replyComment.id) ? true :
                        <IonChip>
                          <IonButtons>
                            <IonButton onClick={e => setReplyComment({})}>
                              <IonIcon slot="icon-only" icon={closeCircleOutline} />
                            </IonButton>
                          </IonButtons>
                          <IonLabel>Re: {replyComment.user}</IonLabel>
                        </IonChip>}
                      <IonInput type="text" placeholder={curr_user === '' ? "Sign in to comment..." : (email_verified !== "YES" ? "Verify email to comment..." : "Add a Comment...")} value={newComment} onIonChange={e => setNewComment(e.detail.value!)} />
                      <IonButtons>
                        <IonButton onClick={e => addComment(vehicle.id, newComment, replyComment.id)}>
                          <IonIcon slot="icon-only" icon={arrowForwardOutline} />
                        </IonButton>
                      </IonButtons>
                    </IonItem>
                  </IonCol>
                </IonRow>
                {comments.map(c =>
                  <CommentCard c={c} />
                )}
              </IonGrid>
            </IonCardContent>
          </IonCard>
        </IonContent>
      }
    </IonPage>
  );
}

export default VehicleCard;
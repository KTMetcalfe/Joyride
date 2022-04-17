import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react"
import { heart, heartOutline, removeCircleOutline, star, starOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { curr_priv, curr_pswd, curr_user, setRefreshQuery } from "../components/StorageService";

const VehicleCard: React.FC<{ id: number; onDismiss: () => void }> = ({ id, onDismiss }) => {
  const [vehicle, setVehicle] = useState<any>({});
  const [favorites, setFavorites] = useState<Array<any>>([]);
  const [update, setUpdate] = useState(false);
  const [ratings, setRatings] = useState<Array<any>>([]);
  const [comments, setComments] = useState<Array<any>>([]);

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

  const getComments = async () => {
    await fetch('https://api.kianm.net/index.php/comments/list', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
      },
      body: '{"vehicle_id":' + id + '}'
    })
      .then(e => e.json())
      .then(result => {
        setComments(result)
      })
    console.log(comments);
  }

  const addComment = (vehicle_id: number, content: string, replied_to: number) => {
    setRefreshQuery(true);
    fetch('https://api.kianm.net/index.php/comments/add', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd),
        'Content-Type': 'application/json'
      },
      body: '{"vehicle_id":' + vehicle_id + ',"content":"' + content + (replied_to === null ? '"' : '","replied_to":' + replied_to) + '}'
    })
      .then(() => setUpdate(true))
  }

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
          getFavorites();
          getRatings();
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
          getFavorites();
          getRatings();
          setVehicle(result[0]);
        })
    }
  }

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

  useEffect(() => {
    if (curr_user !== '' && curr_pswd !== '') {
      getFavorites();
    }
    getComments();
    getRatings();
    getVehicle();
    setUpdate(false);
    // eslint-disable-next-line
  }, [update])

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
                  <IonCol>
                    <IonLabel>Price: </IonLabel>
                    <IonLabel>{vehicle.price}</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>Mileage: </IonLabel>
                    <IonLabel>{vehicle.mileage}</IonLabel>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonLabel>Capacity: </IonLabel>
                    <IonLabel>{vehicle.capacity}</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>User: </IonLabel>
                    <IonLabel>{vehicle.user}</IonLabel>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size={curr_user !== '' ? "7" : "12"}>
                    {ratings.find(r => r.id === vehicle.id) !== undefined ?
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
                        <IonButton disabled={curr_user === ''} onClick={e => { submitRating(vehicle.id, 1); e.stopPropagation() }}>
                          <IonIcon icon={vehicle.rating >= .5 ? star : starOutline} />
                        </IonButton>
                        <IonButton disabled={curr_user === ''} onClick={e => { submitRating(vehicle.id, 2); e.stopPropagation() }}>
                          <IonIcon icon={vehicle.rating >= 1.5 ? star : starOutline} />
                        </IonButton>
                        <IonButton disabled={curr_user === ''} onClick={e => { submitRating(vehicle.id, 3); e.stopPropagation() }}>
                          <IonIcon icon={vehicle.rating >= 2.5 ? star : starOutline} />
                        </IonButton>
                        <IonButton disabled={curr_user === ''} onClick={e => { submitRating(vehicle.id, 4); e.stopPropagation() }}>
                          <IonIcon icon={vehicle.rating >= 3.5 ? star : starOutline} />
                        </IonButton>
                        <IonButton disabled={curr_user === ''} onClick={e => { submitRating(vehicle.id, 5); e.stopPropagation() }}>
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
                        <IonButton onClick={() => removeVehicle(vehicle.id)} size='small' fill='clear' color='danger'>
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
              <IonCardSubtitle>Comments</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {comments.map(c =>
                  <IonItem>
                    <IonText slot="start" color="primary">
                      {c.user}
                    </IonText>
                    <IonText>
                      {c.replied_to !== null ? "RE: " + c.replied_to + " - " : false}
                      {c.content}
                    </IonText>
                  </IonItem>
                )}
              </IonList>
            </IonCardContent>
          </IonCard>
        </IonContent>
      }
    </IonPage>
  );
}

export default VehicleCard;
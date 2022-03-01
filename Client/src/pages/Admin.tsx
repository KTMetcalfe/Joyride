import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSpinner } from "@ionic/react"
import { addCircleOutline, heartOutline, removeCircleOutline } from "ionicons/icons";
import { useState, useEffect } from "react";
import { curr_user, curr_pswd } from "../components/StorageService";

const AdminPage: React.FC = () => {
    const [busy, setBusy] = useState(true);
    const [list, setList] = useState(Array<any>());

    useEffect(() => {
        fetch('https://api.kianm.net/index.php/vehicles/list?admin=true', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': 'Basic ' + btoa(curr_user + ':' + curr_pswd)
            }
        })
            .then(e => e.json())
            .then(result => {
                setList(result);
                setBusy(false);
            })
    })

    return busy ? <IonSpinner /> : (
        <IonPage>
            <IonContent>
                <IonList inset={true}>
                    <IonListHeader>
                        <IonLabel class='ion-text-center'>Vehicles</IonLabel>
                    </IonListHeader>
                    {list.map(v =>
                        <IonItem key={v.id}>
                            <IonGrid>
                                <IonRow>
                                    <IonCol>Make:</IonCol>
                                    <IonCol>{v.make}</IonCol>
                                    <IonCol>Model:</IonCol>
                                    <IonCol>{v.model}</IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>Mileage:</IonCol>
                                    <IonCol>{v.mileage}</IonCol>
                                    <IonCol>Price:</IonCol>
                                    <IonCol>{v.price}</IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>Year:</IonCol>
                                    <IonCol>{v.model_year}</IonCol>
                                    <IonCol>Capacity:</IonCol>
                                    <IonCol>{v.capacity}</IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>User:</IonCol>
                                    <IonCol>{v.user}</IonCol>
                                    <IonCol>
                                        <IonButton>
                                            <IonIcon slot='icon-only' icon={addCircleOutline} />
                                        </IonButton>
                                    </IonCol>
                                    <IonCol>
                                        <IonButton>
                                            <IonIcon slot='icon-only' icon={removeCircleOutline} />
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>
                    )}
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default AdminPage;
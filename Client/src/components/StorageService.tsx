import { Storage, StoragePlugin } from '@capacitor/storage';

const storage: StoragePlugin = Storage;

// App-wide state refresher
export var refreshQuery: boolean = false;
export const setRefreshQuery = (value: boolean) => {
  refreshQuery = value;
}

// Array of options for powertrain type
export const powertrainOptions = [
  { type: 'Gas', isChecked: false },
  { type: 'Electric', isChecked: false },
  { type: 'Hybrid', isChecked: false },
  { type: 'Hydrogen', isChecked: false }
];
// Array of options for vehicle type
export const vehicleTypeOptions = [
  { type: 'Truck', isChecked: false },
  { type: 'Semi', isChecked: false },
  { type: 'Coupe', isChecked: false },
  { type: 'Van', isChecked: false },
  { type: 'Sedan', isChecked: false },
  { type: 'SUV', isChecked: false },
  { type: 'Hatchback', isChecked: false },
  { type: 'Crossover', isChecked: false },
  { type: 'Compact', isChecked: false }
];
// Array of options for vehicle options
export const vehicleOptionOptions = [
  { type: 'A/C', isChecked: false },
  { type: 'Sunroof', isChecked: false },
  { type: 'Heated Seats', isChecked: false },
  { type: 'Cooled Seats', isChecked: false },
  { type: 'Moonroof', isChecked: false },
  { type: 'Automatic Windows', isChecked: false },
  { type: 'Powered Seats', isChecked: false },
  { type: 'Carplay', isChecked: false },
  { type: 'Android Auto', isChecked: false },
  { type: 'Remote Start', isChecked: false },
  { type: 'Keyless Entry', isChecked: false },
];

// Filter limits
export const yearMin = 1900;
export const yearMax = new Date().getFullYear() + 2;
export const capacityMin = 1;
export const capacityMax = 7;
// Filter lists
export let years: Array<number> = [];
for (let year = yearMax; year >= yearMin; year--) {
  years.push(year);
}
export let capacities: Array<number> = [];
for (let cap = capacityMax; cap >= capacityMin; cap--) {
  capacities.push(cap);
}
export let transmissions: Array<string> = ['Manual', 'Automatic'];
export let colors: Array<string> = ['White', 'Black', 'Gray', 'Silver', 'Red', 'Blue', 'Brown',
  'Green', 'Beige', 'Orange', 'Gold', 'Yellow', 'Purple'];
export let makes: Array<string> = ['Toyota', 'Mercedes-Benz', 'Tesla', 'Volkswagen', 'BMW', 'Porsche', 'Honda', 'Ford',
  'Nissan', 'Volvo', 'Audi', 'Hyundai', 'Chevrolet', 'Lexus', 'Land Rover', 'Renault', 'Ferrari', 'Subaru', 'BYD',
  'Haval', 'Cadillac', 'Kia', 'Jeep', 'BUICK', 'Geely', 'Suzuki', 'GMC', 'MINI', 'Polaris', 'RAM Trucks', 'Skoda',
  'Isuzu', 'Scania', 'Mazda', 'Peugeot', 'LI AUTO', 'Lincoln', 'Jaguar', 'NIO', 'Great Wall', 'Hino', 'Bentley',
  'Bajaj Auto', 'Mahindra', 'Maruti Suzuki', 'Xpeng', 'MAN', 'Hero', 'Daihatsu', 'Fiat', 'Lamborghini', 'Iveco',
  'Opel', 'FISKER', 'Foton', 'Jiefang', 'Song', 'Harley-Davidson', 'Citroën', 'Rolls- Royce', 'Dongfeng', 'Acura',
  'McLaren', 'Changan', 'Kenworth', 'Maserati', 'Yamaha', 'Seat', 'Tata Motors', 'Aston Martin', 'Sinotruk',
  'Peterbilt', 'JAC Motors', 'Yutong', 'Dacia', 'Dodge', 'KTM', 'Wuling', 'DAF', 'Roewe', 'Ashok Leyland', 'GAC',
  'Vauxhall', 'TVS', 'Oshkosh', 'Paccar', 'Royal Enfield', 'Tang', 'WEY', 'Mack', 'Infiniti', 'Yulon', 'MG', 'Lada',
  'Qin', 'Piaggio', 'Renault Samsung', 'UD Trucks', 'Baojun', 'ELMS',]

export const baseFilter: object = {
  "year_start": null,
  "year_end": null,
  "price_start": null,
  "price_end": null,
  "capacity_start": null,
  "capacity_end": null,
  "mileage_start": null,
  "mileage_end": null,
  "transmission_type": null,
  "vehicle_color": null,
  "make": null,
  "model": null,
  "rating_start": null,
  "powertrains_list": null,
  "vehicle_types_list": null,
  "vehicle_options_list": null
}
export var filter = baseFilter;
export const setFilter = (value: object) => {
  filter = value;
}
// App-wide wipe and refresh query
export var resetQuery: boolean = false;
export const setResetQuery = (value: boolean) => {
  resetQuery = value;
}

// Universal user informaton
export var curr_email: string = '';
export var curr_user: string = '';
export var curr_pswd: string = '';
export var curr_priv: number = 0;
export var email_verified: string = '';

// Stores a given user's information
export const setCurrentAccount = async (email: string, user: string, pswd: string, priv: number, verified: string) => {
  await storage.set({
    key: 'account',
    value: JSON.stringify('{"email":"' + email + '","user":"' + user + '","pswd":"' + pswd + '","priv":"' + priv + '","verified":"' + verified +'"}')
  });
  curr_email = email;
  curr_user = user;
  curr_pswd = pswd;
  curr_priv = priv;
  email_verified = verified;
  return getCurrentAccount();
}

// Retrieves current stored account in storage
export const getCurrentAccount = async () => {
  const { value } = await storage.get({ key: 'account' });
  let account = JSON.parse(value as string);
  return account;
}

// Runs on app start, loads and checks user information
export const onLoad = async () => {
  try {
    console.log("Checking user...");

    const { value } = await storage.get({ key: 'account' });

    let acc = JSON.parse(value as string);
    let account = JSON.parse(acc);

    if (account === null) {
      throw new Error("No account in storage")
    }

    await fetch('https://api.kianm.net/index.php/login/validate', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': 'Basic ' + btoa(account.user + ':' + account.pswd)
      }
    })
      .then(e => e.json())
      .then(result => {
        if (result.isVerified === true) {
          curr_email = result.email;
          curr_user = account.user;
          curr_pswd = account.pswd;
          curr_priv = result.priveledge;
          email_verified = result.email_verified;
          console.log("User validated");
        } else {
          console.log("Mismatch between local and remote user");
        }
      })

  } catch (e) {
    console.error(e);
  }
}

// Wipes all data in storage
export const clearStorage = async () => {
  storage.clear();
}
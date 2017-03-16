export function fetchPets() {
  const pets = [
    {id: 1, name: 'Grover', description: 'A Furry Blue Guy who is very cute'},
    {id: 2, name: 'Fido', description: 'A pretty normal looking dog'},
    {id: 3, name: 'Sparky', description: 'Orange cat with a laid back attitude'}
  ];
  return {
    type: 'FETCH_PETS',
    pets
  };
}

export function addPet(pet){
  return {
    type: 'ADD_PET',
    pet
  };
};

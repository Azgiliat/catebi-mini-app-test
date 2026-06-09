export type Cat = {
  name: string;
  sex: "m" | "f";
  age: string;
  color: string;
  image: string;
  about: string;
};

export const cats: Cat[] = [
  {
    name: "Luna",
    sex: "f",
    age: "adoption.values.age.sixMonths",
    color: "adoption.values.color.brownTabby",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=480&q=80",
    about: "Luna is a gentle kitten who loves quiet corners and warm laps.",
  },
  {
    name: "Oliver",
    sex: "m",
    age: "adoption.values.age.threeMonths",
    color: "adoption.values.color.orangeTabby",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=480&q=80",
    about: "Oliver is playful, curious, and ready to turn any box into a toy.",
  },
  {
    name: "Mittens",
    sex: "f",
    age: "adoption.values.age.twoYears",
    color: "adoption.values.color.calico",
    image:
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=480&q=80",
    about: "Mittens is calm, affectionate, and happiest beside people.",
  },
  {
    name: "Max",
    sex: "m",
    age: "adoption.values.age.fourMonths",
    color: "adoption.values.color.whiteWithBlackPatches",
    image:
      "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=480&q=80",
    about: "Max is energetic and social, with a soft spot for feather toys.",
  },
  {
    name: "Whiskers",
    sex: "m",
    age: "adoption.values.age.fiveMonths",
    color: "adoption.values.color.brownTabby",
    image:
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=480&q=80",
    about: "Whiskers is confident, talkative, and quick to greet new friends.",
  },
  {
    name: "Bella & Milo",
    sex: "f",
    age: "adoption.values.age.fourMonths",
    color: "adoption.values.color.silverTabby",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=480&q=80",
    about: "Bella and Milo are bonded kittens who should find a home together.",
  },
  {
    name: "Shadow",
    sex: "m",
    age: "adoption.values.age.oneYear",
    color: "adoption.values.color.blackAndBrownMix",
    image:
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=480&q=80",
    about: "Shadow is independent at first, then deeply loyal once he trusts you.",
  },
  {
    name: "Ginger",
    sex: "f",
    age: "adoption.values.age.threeMonths",
    color: "adoption.values.color.brownTabby",
    image:
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=480&q=80",
    about: "Ginger is bright, affectionate, and always interested in playtime.",
  },
];

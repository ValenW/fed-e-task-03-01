import { init } from "snabbdom/build/package/init";
import { classModule } from "snabbdom/build/package/modules/class";
import { propsModule } from "snabbdom/build/package/modules/props";
import { styleModule } from "snabbdom/build/package/modules/style";
import { eventListenersModule } from "snabbdom/build/package/modules/eventlisteners";
import { h } from "snabbdom/build/package/h";

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
]);
const originalData = [
  {
    rank: 1,
    title: "The Shawshank Redemption",
    desc:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    elmHeight: 0,
  },
  {
    rank: 2,
    title: "The Godfather",
    desc:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    elmHeight: 0,
  },
  {
    rank: 3,
    title: "The Godfather: Part II",
    desc:
      "The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.",
    elmHeight: 0,
  },
  {
    rank: 4,
    title: "The Dark Knight",
    desc:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.",
    elmHeight: 0,
  },
  {
    rank: 5,
    title: "Pulp Fiction",
    desc:
      "The lives of two mob hit men, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    elmHeight: 0,
  },
  {
    rank: 6,
    title: "Schindler's List",
    desc:
      "In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    elmHeight: 0,
  },
  {
    rank: 7,
    title: "12 Angry Men",
    desc:
      "A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.",
    elmHeight: 0,
  },
  {
    rank: 8,
    title: "The Good, the Bad and the Ugly",
    desc:
      "A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.",
    elmHeight: 0,
  },
  {
    rank: 9,
    title: "The Lord of the Rings: The Return of the King",
    desc:
      "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    elmHeight: 0,
  },
  {
    rank: 10,
    title: "Fight Club",
    desc:
      "An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker and they form an underground fight club that evolves into something much, much more...",
    elmHeight: 0,
  },
];
const margin = 8;

let data = [
  originalData[0],
  originalData[1],
  originalData[2],
  originalData[3],
  originalData[4],
  originalData[5],
  originalData[6],
  originalData[7],
  originalData[8],
  originalData[9],
];

let sortBy = "rank";
let nextKey = 11;
let rootNode;

/**
 *
 * @param {string} type rank | title | desc
 */
function sort(type) {
  console.log("sort: ", type);
  type === sortBy
    ? data.reverse()
    : (data = data = data.sort((a, b) => (a[type] > b[type] ? 1 : -1)));
  sortBy = type;
  render();
}

function add() {
  console.log("add");
  const addedItem =
    originalData[Math.floor(Math.random() * originalData.length)];
  data.splice(0, 0, { ...addedItem, rank: nextKey++ });
  render();
}

function remove(item) {
  console.log("remove: ", item);
  const index = data.findIndex((d) => d.rank === item.rank);
  data.splice(index, 1);
  render();
}

function render() {
  data.forEach((d, i) =>
    i === 0
      ? (d.offset = margin)
      : (d.offset = data[i - 1].offset + margin + data[i - 1].elmHeight)
  );
  rootNode = patch(rootNode, view());
}

function view() {
  console.log(data.map((d) => [d.elmHeight, d.offset]));
  return h("div#container", [
    h("h1", "Top 10 movies"),
    h("div.btn-wrapper", [
      "Sort by: ",
      h("span.btn-group", [
        h(
          "a.btn.rank",
          {
            class: { active: sortBy === "rank" },
            on: { click: () => sort("rank") },
          },
          "Rank"
        ),
        h(
          "a.btn.title",
          {
            class: { active: sortBy === "title" },
            on: { click: () => sort("title") },
          },
          "Title"
        ),
        h(
          "a.btn.desc",
          {
            class: { active: sortBy === "desc" },
            on: { click: () => sort("desc") },
          },
          "Description"
        ),
      ]),
      h("a.btn.add", { on: { click: add } }, "Add"),
    ]),
    h(
      "div.list",
      data.map((item) =>
        h(
          "div.row",
          {
            key: item.rank,
            style: {
              opacity: 0,
              transform: "translate(-200px)",
              // delayed中通常放一般样式, 当其属性变化时, 会自动添加动画
              // 如初次添加时会从opacity 0 1s内线性变化至 opacity 1
              delayed: {
                transform: `translateY(${item.offset}px)`,
                opacity: 1,
              },
              // 使用和delayed类似, 在从dom tree移除时触发
              remove: {
                opacity: 0,
                transform: `translateY(${item.offset}px) translateX(200px)`,
              },
            },
            hook: {
              insert: (vNode) => (item.elmHeight = vNode.elm.offsetHeight),
            },
          },
          [
            h("div", { style: { fontWeight: "bold" } }, item.rank),
            h("div.movie-title", item.title),
            h("div.movie-description", item.desc),
            h("div.btn.rm-btn", { on: { click: () => remove(item) } }, "x"),
          ]
        )
      )
    ),
  ]);
}

function initPage() {
  const container = document.getElementById("container");
  rootNode = patch(container, view());
  render();
}

initPage();

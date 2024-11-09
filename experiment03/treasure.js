const other = document.getElementById("other");
const chat = document.getElementById("chat");
const genie = document.getElementById("genie");

async function readTreasureHuntFile(filePath) {
  
  const response = await fetch(filePath);
  if (!response.ok) {
    console.error(`Error fetching ${filePath}:`, response.status);
  }
  const text = await response.text();
  console.log(text);
  const parts = text.split('---');
  console.log(parts[0]);

  return {
    library: parts[0],
    temple: parts[1],
    guard: parts[2],
    genie: parts[3],
    treasure: parts[4]
  };
}

// 模拟宝藏地图API
class TreasureMap {
  static getInitialClue(treasureHuntData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        chat.innerHTML = treasureHuntData.library;
        resolve("在古老的图书馆里找到了第一个线索...");
      }, 1000);
    });
  }

  static decodeAncientScript(clue,treasureHuntData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!clue) {
          chat.innerHTML = "没有线索可以解码!";
          reject("没有线索可以解码!");
        }
        resolve("解码成功!宝藏在一座古老的神庙中...");
      }, 1500);
    });
  }

  static searchTemple(location,treasureHuntData) {
    return new Promise((resolve, reject) => {
      chat.innerHTML = treasureHuntData.temple;
      setTimeout(() => {

        const random = Math.random();
        chat.innerHTML = "";
        if (random < 0.5) {
          other.src = "./img/shouwei.png";
          other.style.width = "400px";
          other.style.height = "400px";
          reject("糟糕!遇到了神庙守卫!");
        } else {
          other.src = "./img/baoxiang.jpg";
          other.style.width = "400px";
          other.style.height = "400px";
          resolve("找到了一个神秘的箱子...");
        }
      }, 2000);
    });
  }

  static encounterGenie(box,treasureHuntData) {
    return new Promise((resolve, reject) => {
      genie.hidden = false;
      setTimeout(() => {
        const random = Math.random();
        if (random < 0.2) {
          other.src = "./img/qiapo.jpg"
          other.style.width = "200px";
          other.style.height = "150px";
          chat.innerHTML = treasureHuntData.genie;
          reject("宝箱消失，由于贪婪导致无法寻求宝藏。");
        } else {
          other.src = "./img/qiapo.jpg"
          other.style.width = "200px";
          other.style.height = "150px";
          chat.innerHTML = "精灵将宝箱封印解除。";
          resolve("精灵将宝箱封印解除。");
        }
      }, 2500);
    });
  }

  static openTreasureBox(treasureHuntData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        genie.hidden = true;
        chat.innerHTML = "";
        other.src = "./img/baoxiang_open.png"
        other.style.width = "400px";
        other.style.height = "400px";
        resolve(treasureHuntData.treasure);
      }, 1000);
    });
  }
}



async function findTreasureWithPromises() {

  try {
    const treasureHuntData = await readTreasureHuntFile('./game.txt');
    const clue = await TreasureMap.getInitialClue(treasureHuntData);
    console.log(clue);

    const location = await TreasureMap.decodeAncientScript(clue, treasureHuntData);
    console.log(location);

    const box = await TreasureMap.searchTemple(location, treasureHuntData);
    console.log(box);

    const genie = await TreasureMap.encounterGenie(box, treasureHuntData);
    console.log(genie);

    const treasure = await TreasureMap.openTreasureBox(treasureHuntData);
    console.log(treasure);
    updateWinTimes();
    window.location.href = "./win.html";
  } catch (error) {
    console.error("任务失败:", error);
    updateFailTimes();
    window.location.href = `./fail.html?message=${error}`;
  }
}

function showInformation() {
  var userId = localStorage.getItem("userId");
  var userName = localStorage.getItem("userName");
  var winTimes = localStorage.getItem("winTimes") || 0;
  var failTimes = localStorage.getItem("failTimes") || 0;
  document.getElementById("userName").innerHTML = "昵称：" + userName;
  document.getElementById("userId").innerHTML = "玩家ID：" + userId;
  document.getElementById("winTimes").innerHTML = "胜利次数：" + winTimes;
  document.getElementById("failTimes").innerHTML = "失败次数：" + failTimes;
}

function updateWinTimes() {
  var winTimes = localStorage.getItem("winTimes") || 0;
  winTimes++;
  localStorage.setItem("winTimes", winTimes);
}
function updateFailTimes(){
  var failTimes = localStorage.getItem("failTimes") || 0;
  failTimes++;
  localStorage.setItem("failTimes", failTimes);
}

showInformation();
findTreasureWithPromises();
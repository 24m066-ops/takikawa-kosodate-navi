function fav(b){b.textContent="★ お気に入り登録済み";b.style.background="#f8d9cf"}function findPlace(){let v=document.getElementById("placeInput").value.trim();alert(v?`「${v}」を検索しました。`:"検索したい施設を入力してください。")}function saveRecord(e){e.preventDefault();let d=document.getElementById("rdate").value,t=document.getElementById("rtitle").value,x=document.getElementById("rtext").value;let list=JSON.parse(localStorage.getItem("records")||"[]");list.unshift({d,t,x});localStorage.setItem("records",JSON.stringify(list));showRecords();e.target.reset();alert("成長記録を保存しました！")}function showRecords(){let el=document.getElementById("recordList");if(!el)return;let list=JSON.parse(localStorage.getItem("records")||"[]");el.innerHTML=list.map(r=>`<div class="record"><b>🌱 ${r.t}</b><br><small>${r.d}</small><p>${r.x||""}</p></div>`).join("")}function sendContact(e){e.preventDefault();alert("連絡帳を送信しました！（デモ）");e.target.reset()}function sendChat(){let i=document.getElementById("chatInput"),v=i.value.trim();if(!v)return;document.getElementById("chatList").innerHTML+=`<div class="bubble me">${v}</div>`;i.value=""}showRecords();
// ログイン処理
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    message.textContent = "ログイン中...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      message.textContent = "ログインできませんでした。メールアドレスとパスワードを確認してね。";
      return;
    }

    message.textContent = "ログインできたよ！🌷";
  });
}

async function fav(b) {
  const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError || !user) {
    alert("先にホーム画面でログインしてね。");
    return;
  }

  const card = b.closest(".card");
  const place_name = card.querySelector("h3").textContent.trim();
  const place_id = place_name.includes("公園") ? "park" : "hospital";

  b.disabled = true;

  try {
    const { data, error: checkError } = await supabaseClient
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("place_id", place_id);

    if (checkError) throw checkError;

    if (data.length > 0) {
      const { error } = await supabaseClient
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("place_id", place_id);

      if (error) throw error;

      b.textContent = "☆ お気に入り";
      b.style.background = "";
      alert("お気に入りを解除しました！🌷");

    } else {
      const { error } = await supabaseClient
        .from("favorites")
        .insert([{
          user_id: user.id,
          place_id: place_id,
          place_name: place_name
        }]);

      if (error) throw error;

      b.textContent = "★ お気に入り登録済み";
      b.style.background = "#f8d9cf";
      alert("お気に入りを保存しました！🌷");
    }

  } catch (error) {
    console.error(error);
    alert("お気に入りの変更に失敗しました。");
  } finally {
    b.disabled = false;
  }
}
function findPlace() {
  const keyword = document.getElementById("placeInput").value.trim();

  if (!keyword) {
    alert("検索したい施設を入力してね！");
    return;
  }

  const map = document.getElementById("facilityMap");
  const searchWord = "北海道滝川市 " + keyword;

  const url = "https://www.google.com/maps?q="
    + encodeURIComponent(searchWord)
    + "&output=embed";

  map.src = url;
}
async function saveRecord(e) {
  e.preventDefault();

  const message = document.getElementById("recordMessage");
  const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError || !user) {
    alert("先にホーム画面でログインしてね。");
    return;
  }

  const record_date = document.getElementById("rdate").value;
  const title = document.getElementById("rtitle").value.trim();
  const notes = document.getElementById("rtext").value.trim();

  const { error } = await supabaseClient
    .from("growth_records")
    .insert([{
      user_id: user.id,
      record_date,
      title,
      notes
    }]);

  if (error) {
    console.error(error);
    alert("保存できませんでした。データベースの設定を確認しよう。");
    return;
  }

  e.target.reset();
  await showRecords();
  alert("成長記録をSupabaseに保存しました！🌷");}
async function showRecords() {
  const el = document.getElementById("recordList");
  if (!el) return;

  const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError || !user) {
    el.textContent = "記録を見るには、先にログインしてね。";
    return;
  }

  const { data, error } = await supabaseClient
    .from("growth_records")
    .select("record_date, title, notes")
    .eq("user_id", user.id)
    .order("record_date", { ascending: false });

  if (error) {
    console.error(error);
    el.textContent = "記録を読み込めませんでした。";
    return;
  }

  if (!data || data.length === 0) {
    el.textContent = "まだ成長記録はありません。";
    return;
  }

  el.innerHTML = data.map(r => `
    <div class="record">
      <b>🌱 ${r.title}</b><br>
      <small>${r.record_date}</small>
      <p>${r.notes || ""}</p>
    </div>
  `).join("");
}function sendContact(e){e.preventDefault();alert("連絡帳を送信しました！（デモ）");e.target.reset()}function sendChat(){let i=document.getElementById("chatInput"),v=i.value.trim();if(!v)return;document.getElementById("chatList").innerHTML+=`<div class="bubble me">${v}</div>`;i.value=""}showRecords();
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
    await showRecords();
  });
}
async function loadFavorites() {
  const buttons = document.querySelectorAll("#places .card button");
  if (buttons.length === 0) return;

  const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError || !user) return;

  const { data, error } = await supabaseClient
    .from("favorites")
    .select("place_id")
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return;
  }

  buttons.forEach(b => {
    const card = b.closest(".card");
    const place_name = card.querySelector("h3").textContent.trim();
    const place_id = place_name.includes("公園") ? "park" : "hospital";

    if (data.some(f => f.place_id === place_id)) {
      b.textContent = "★ お気に入り登録済み";
      b.style.background = "#f8d9cf";
    } else {
      b.textContent = "☆ お気に入り";
      b.style.background = "";
    }
  });
}

loadFavorites();

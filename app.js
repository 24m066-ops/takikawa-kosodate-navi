function fav(b){b.textContent="★ お気に入り登録済み";b.style.background="#f8d9cf"}function findPlace(){let v=document.getElementById("placeInput").value.trim();alert(v?`「${v}」を検索しました。`:"検索したい施設を入力してください。")}async function saveRecord(e) {
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
  });
}

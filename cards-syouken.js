document.addEventListener("DOMContentLoaded", function () {
  const target = document.getElementById("securities-list");

  target.innerHTML = `
  <div class="anime-item">
   <section class="category-section" id="sec-securities">
      <h2 class="linecenter">証券会社一覧(株式取引)</h2>
      <div class="my-card-grid">
      
      <a href="https://tousiportal.jp/matsui-kabu.html" class="card">
        <img src="Xcard/320-250-20000.jpg" alt="松井証券のバナー" loading="lazy" width="300" height="250">
        <span>松井証券<br><small class="fee-rating" data-stars="3">手数料</small></span>
      </a>  <!-- ← これが抜けてた！ -->

      <a href="https://tousiportal.jp/DMM-kabu.html" class="card">
        <img src="Xcard/300_250.png" alt="DMM株のバナー" loading="lazy" width="300" height="250">
        <span>DMM株<br><small class="fee-rating" data-stars="3">手数料</small></span>
      </a>

      <a href="https://tousiportal.jp/Monex.html" class="card">
        <img src="Xcard/imagesender (1).jfif" alt="マネックス証券のバナー" loading="lazy" width="300" height="250">
        <span>マネックス証券<br><small class="fee-rating" data-stars="2" data-draft="true">手数料</small></span>
      </a>

      <a href="https://tousiportal.jp/bloomo.html" class="card">
        <img src="Xcard/imagesender (2).png" alt="Bloomo証券のバナー" loading="lazy" width="300" height="250">
        <span>Bloomo証券<br><small class="fee-rating" data-stars="2" data-draft="true">手数料</small></span>
      </a>

      <a href="https://tousiportal.jp/moomoo-kabu.html" class="card">
        <img src="Xcard/moomooookuchi1200675.png" alt="moomoo証券のバナー" loading="lazy" width="300" height="250">
        <span>moomoo証券<br><small class="fee-rating" data-stars="2" data-draft="true">手数料</small></span>
      </a>

      <a href="https://tousiportal.jp/MUFGesmart.html" class="card">
        <img src="Xcard/34-200x200.jpg" alt="三菱UFJ eスマート証券のバナー" loading="lazy" width="300" height="250">
        <span>三菱UFJ eスマート<br><small class="fee-rating" data-stars="2" data-draft="true">手数料</small></span>
      </a>
      
      <a href="https://tousiportal.jp/Webull.html" class="card">
        <img src="Xcard/imagesender (3).png" alt="Webull証券のバナー" loading="lazy" width="300" height="250">
        <span>Webull証券<br><small class="fee-rating" data-stars="1" data-draft="true">手数料</small></span>
      </a>

      <a href="https://tousiportal.jp/saxo.html" class="card">
        <img src="Xcard/300x250_Banner_Affiliate_AT_Stocks.png" alt="SAXO証券のバナー" loading="lazy" width="300" height="250">
        <span>SAXO証券<br><small class="fee-rating" data-stars="1" data-draft="true">手数料</small></span>
      </a>

      <a href="https://tousiportal.jp/SBI.html" class="card">
        <img src="Xcard/imagesender (4).jfif" alt="SBI証券のバナー" loading="lazy" width="300" height="250">
        <span>SBI証券<br><small class="fee-rating" data-stars="3">手数料</small></span>
      </a>

      <a href="https://tousiportal.jp/GMO-syouken.html" class="card">
        <img src="Xcard/imagesender.gif" alt="GMOクリック証券のバナー" loading="lazy" width="300" height="250">
        <span>GMOクリック証券<br><small class="fee-rating" data-stars="3">手数料</small></span>
      </a>

      <a href="https://tousiportal.jp/tryauto.html" class="card">
        <img src="Xcard/imagesender.png" alt="トライオートCFDのバナー" loading="lazy" width="300" height="250">
        <span>トライオートCFD<br><small class="fee-rating fee-na">手数料</small></span>
      </a>


      </div>
    
    </section>
  </div>
  `;
});

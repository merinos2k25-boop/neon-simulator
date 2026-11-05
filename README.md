# ⚡ Neon Futbol Simülatörü

İki takım karşılaşmalı ve lig çember eleme (Battle Royale) modlu, canlı neon temalı futbol simülatörü oyunu. 
Mobil ve masaüstü tam uyumludur; Vercel üzerinde tek tıkla canlıya alınabilir.

---

## 🎮 Oyun Modları

### 1. ⚽ Kick Off (1v1 İki Takım Karşılaşması)
- Seçilen iki takım neon çember içerisinde yüksek tempolu 2D fizik kurallarıyla çarpışır ve çembere çarparak hareket eder.
- **Süre Sistemi**: 45' ilk yarı + 45' ikinci yarı = toplam 90 dakika + 5 dakika uzatma süresi (toplam 95').
- **Hız Ayarı**: Varsayılan **2x hızında** geçer; istendiğinde 1x, 4x ve 8x hız seçenekleri seçilebilir.
- **Kaleye Giren Skor Üretir**: Takım diski kaleye girdiğinde **"GOOOOOL!"** neon patlaması, gol sireni ve stadyum tezahürat sesi çıkar.
- **Düdük Sistemi**: İlk yarı sonunda tek uzun düdük, maç sonunda 3'lü bitiş düdüğü çalar.
- **Maç Sonu**: Toplam skor, kazanan takım kutlaması ve maç istatistikleri görüntülenir.
- **Puan Durumu**: Maç sonuçları otomatik olarak lig puan tablosuna işlenir (G: 3P, B: 1P, M: 0P).

### 2. 💥 Lig Çember Eleme Modu (Battle Royale)
- Seçilen ligdeki tüm takımlar (örneğin Trendyol Süper Lig'in 18 takımı veya Şampiyonlar Ligi'nin 32 takımı) aynı anda çember içine girer.
- **Ters Kural**: Bu modda **kaleye giren takım ELENİR** ve çemberden çıkar!
- Elenen her takım için kırmızı lazer patlaması ve **"ELENDİ!"** duyurusu yapılır.
- Canlı sayaç kalan takım sayısını ve son elenen takımı gösterir.
- Çemberde **sona kalan tek takım LİG ŞAMPİYONU** ilan edilir ve kupa zafer müziği çalar!

### 3. 🏆 Neon Süper Kupa (Turnuva Modu)
- 8 takımlı eliminasyon ağacı (Çeyrek Final -> Yarı Final -> Büyük Final).
- Canlı eşleşme ağacı (Bracket) üzerinden maçlar tek tek oynatılabilir.

---

## 🏆 Kapsanan Ligler ve Takımlar (113+ Takım)

1. **Şampiyonlar Ligi 26-27 Sezonu (32 Takım)**:
   - Real Madrid, Manchester City, FC Bayern Münih, Paris Saint-Germain, Liverpool FC, Arsenal, FC Barcelona, Inter Milan, Borussia Dortmund, Atlético Madrid, Bayer Leverkusen, Juventus, Sporting CP, Aston Villa, RB Leipzig, Atalanta, Benfica, AC Milan, Feyenoord, PSV Eindhoven, Club Brugge, Shakhtar Donetsk, Galatasaray SK, Fenerbahçe SK, SK Slavia Prag, FC Porto, FK Bodø/Glimt, Slovan Bratislava, LOSC Lille, VfB Stuttgart, AS Roma, SSC Napoli.

2. **Trendyol Süper Lig (18 Takım)**:
   - Galatasaray SK, Fenerbahçe SK, Beşiktaş JK, Trabzonspor, RAMS Başakşehir, Samsunspor, Eyüpspor, Kasımpaşa, Göztepe, Sivasspor, Antalyaspor, Alanyaspor, Çaykur Rizespor, Gaziantep FK, Kayserispor, Konyaspor, Bodrum FK, Hatayspor.

3. **Premier Lig (20 Takım)**:
   - Manchester City, Arsenal, Liverpool FC, Aston Villa, Tottenham Hotspur, Chelsea FC, Newcastle United, Manchester United, West Ham United, Crystal Palace, Brighton, Bournemouth, Fulham, Wolverhampton, Everton, Brentford, Nottingham Forest, Leicester City, Southampton, Ipswich Town.

4. **İspanya La Liga (20 Takım)**:
   - Real Madrid, FC Barcelona, Atlético Madrid, Athletic Bilbao, Real Sociedad, Real Betis, Villarreal CF, Valencia CF, Sevilla FC, Osasuna, Getafe, Celta Vigo, Mallorca, Rayo Vallecano, Las Palmas, Alavés, Espanyol, Leganés, Real Valladolid, Girona.

5. **Fransa Ligue 1 (18 Takım)**:
   - Paris Saint-Germain, AS Monaco, Brest, LOSC Lille, Nice, Lyon, Lens, Marsilya, Reims, Rennes, Toulouse, Montpellier, Strasbourg, Nantes, Le Havre, Auxerre, Angers, Saint-Étienne.

6. **Özel / Diğer Takımlar (Word Dosyasından)**:
   - Como 1907, AEK Atina, Sabah FK, LASK Linz, Viking FK.

---

## 🔊 Ses & Efekt Motoru (Web Audio API)
- Dışarıdan MP3 yükleme gerektirmez, tamamen tarayıcının yerel **Web Audio API** synthesizer'ı ile üretilir (asla kırık link veya yükleme hatası olmaz).
- Çembere her çarpmada neon titreşim efekti ve çarpma sesi.
- Kaleye gol olduğunda gol kornası ve stadyum tezahüratı.
- Gerçekçi hakem düdüğü (çift frekanslı hava titreşimi).
- Battle Royale eleme sesi ve şampiyonluk zafer fanfarı.

---

## 🚀 Vercel'e Dağıtım (Deployment)

Bu proje sıfır derleme adımı gerektiren modern ES modülleri ve HTML5 Canvas ile geliştirilmiştir.

### Seçenek 1: Vercel CLI ile
```bash
npm install -g vercel
vercel
```

### Seçenek 2: GitHub & Vercel Dashboard
1. Bu klasörü bir GitHub deposuna yükleyin:
   ```bash
   git init
   git add .
   git commit -m "Neon Futbol Simulator"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) adresine gidin -> **"Add New Project"** seçin.
3. GitHub deponuzu seçin ve **"Deploy"** butonuna basın. Projeniz saniyeler içinde yayında olacaktır!

---

## 💻 Yerel Çalıştırma (Local Development)

Herhangi bir statik sunucuyla çalıştırabilirsiniz:
```bash
# Node.js npx ile:
npx serve .

# veya Python ile:
python -m http.server 8000
```
Tarayıcınızda `http://localhost:8000` (veya `http://localhost:3000`) adresini açın.

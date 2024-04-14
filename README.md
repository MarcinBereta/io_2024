# Inżynieria Oprogramowania

## Temat Projekt:
Aplikacja dla potrzeb wstępnej analizy i wizualizacji danych.
Założenia:
Logowanie 1-etapowe. Dane pobierane są z plików csv. Liczba zmiennych (nawet do 100).
Oczekiwane funkcjonalności:

1. Automatyczne wykrywanie typów danych z możliwością edycji.
2. Prosta zmiana nazw zmiennych.
3. Podstawowe statystyki opisowe 1D EDA (adekwatne do typu zmiennej) - oczekiwane propozycje
4. Podstawowe wizualizacje jednej zmiennej (adekwatne do typu zmiennej) w zadanym przedziale czasowym - oczekiwane propozycje.
5. Uzupełnianie brakujących wartości / poprawa odstających wartości dla zmiennych (adekwatne do typu zmiennej) - oczekiwane propozycje (możliwość łatwego powrotu do punktu 3)
6. Podstawowe miary zależności pomiędzy zmiennymi 2D EDA (adekwatne do typów zmiennych) - oczekiwane propozycje
7. Podstawowe wizualizacje dwóch/trzech zmiennych (adekwatne do typów zmiennych) w zadanym przedziale czasowym oczekiwane propozycje.
   Ponadto:
8. pobranie danych przez użytkownika (plik csv) z zadanego zakresu (wybór zmiennych, wybór przypadków).
9. możliwość zapisania wygenerowanych wykresów w formacie jpg oraz png.
   Wyjściem z aplikacji jest "wyczyszczony" zbiór danych dla dalszych analiz.

## Uruchomienie projektu
### Sprawdzanie przez prowadzących

**Tymczasowo projekt jest postawiony na serwerze pod adresem `http://95.217.87.137:3050/`. Po wejściu na tą stronę wystarczy się tylko zarejsetrować i można korzystać ze wszytskich funkcjonalności. Projekt znajduje się na serwerze, aby ułatwić sprawdzanie prowadzącym przedmiot, w późniejszym czasie zostanie on zdjęty i trzeba będzie korzystać z wersji localhost.**

### Jak uruchomić wersję localhost (po wyłączniu na serwerze)

Potrzebne narzędzie i programy:

- Docker
- NPM
- Python

Najpierw należy pobrać program Docker Desktop oraz archiwum 'Data_explorer - wersja localhost'.
Następnie w głównym katalogu projektu należy uruchomić następujące komendy:

- `npm i`
- `docker compose up -d postgre_IO`

W katalogo web należy użyć:

- `npx prisma db push `
- `npm run dev`

Aby uruchomić część frontendową dostępną w przeglądarce należy wpisać `http://localhost:3000/`

W katalogu "backend" należy wpisać komendy:

- `prisma generate`
- `pip install -r requirements.txt`
- `python app.py`

Może okazać się potrzebne także:

`python prisma db push`

Konterner w Dockerze pozwoli nam na korzystanie z bazy danych. Po wpisaniu wszytskich komend oraz włączeniu odpowiednio Dockera aplikacja powinna działać bez zarzutu.

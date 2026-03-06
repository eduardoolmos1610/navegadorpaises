import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs'; // 👈 Necesario para convertir Observable a Promise
import { ChangeDetectorRef} from '@angular/core'; // 1. Importar
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); // 2. Inyectar
  
  allCountries: any[] = [];
  filteredCountries: any[] = [];
  selectedCountry: any = null;
  similarCountries: any[] = [];
  loading: boolean = true;

  // Convertimos ngOnInit en una función asíncrona
  async ngOnInit() {

    const url = 'https://restcountries.com/v3.1/all?fields=name,flags,cca3,capital,population,region,languages,car';
    try {
      // 1. Ejecutamos la petición de forma asíncrona
      // Usamos lastValueFrom para esperar el resultado sin .subscribe()
      const data = await lastValueFrom(this.http.get<any[]>(url));
      
      // 2. Procesamos los datos una vez recibidos
      this.allCountries = data.sort((a, b) => 
        a.name.common.localeCompare(b.name.common)
      );
      
      this.filteredCountries = [...this.allCountries];
      
    } catch (error) {
      console.error('Error al cargar los países:', error);
    } finally {
      // 3. Quitamos el estado de carga al terminar (éxito o error)
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  // ... (tus funciones de search y showDetails se mantienen igual)

  // Función que se ejecuta cada vez que el usuario escribe
onSearch(event: any) {
  // 1. Cerramos la tarjeta de detalles inmediatamente al escribir
  this.selectedCountry = null;

  const query = event.target.value.toLowerCase();
  
  if (!query) {
    this.filteredCountries = [...this.allCountries];
  } else {
    this.filteredCountries = this.allCountries.filter(country => {
      const nameMatch = country.name.common.toLowerCase().includes(query);
      const codeMatch = country.cca3.toLowerCase().includes(query);
      const carMatch = country.car?.side?.toLowerCase().includes(query);
      
      const languagesArray = country.languages ? Object.values(country.languages) : [];
      const languageMatch = languagesArray.some(lang => 
        String(lang).toLowerCase().includes(query)
      );

      return nameMatch || codeMatch || carMatch || languageMatch;
    });
  }

  // Forzamos a Angular a renderizar los cambios (evita que se quede "congelado")
  this.cdr.detectChanges();
}
// Agrega esta interfaz o usa 'any'
async showDetails(country: any) {
  this.selectedCountry = country;
  
  // 1. Lógica de población similar (se mantiene)
  const pop = country.population;
  const rango = 5000000;
  this.similarCountries = this.allCountries
    .filter(c => Math.abs(c.population - pop) <= rango && c.cca3 !== country.cca3)
    .slice(0, 3);

  // 2. Obtener PIB del país seleccionado
  this.selectedCountry.gdp = await this.getGDP(country.cca3);

  // 3. Obtener PIB de los países similares para la gráfica
  for (let s of this.similarCountries) {
    s.gdp = await this.getGDP(s.cca3);
  }
  
  this.cdr.detectChanges();
}

async getGDP(isoCode: string): Promise<number> {
  try {
    // Llamada al Banco Mundial (NY.GDP.MKTP.CD = PIB total en USD)
    const url = `https://api.worldbank.org/v2/country/${isoCode}/indicator/NY.GDP.MKTP.CD?format=json&MRV=1`;
    const res: any = await lastValueFrom(this.http.get(url));
    
    // El Banco Mundial devuelve [metadatos, datos]
    return res[1] ? res[1][0].value : 0;
  } catch {
    return 0;
  }
}
  // Dentro de tu clase App
getPercentage(similarPop: number, selectedPop: number): number {
  // Calculamos qué tan cerca está la población (máximo 100%)
  const ratio = (similarPop / selectedPop) * 100;
  return ratio; 
}
}
# BDSM Role Assessment

Aplicación de escritorio en Java que implementa un cuestionario estructurado para explorar preferencias de rol a partir de varias dimensiones conductuales. Está pensado como herramienta de análisis exploratorio, no como test clínico.

## Descripción

Formulario de más de 100 ítems con escala tipo Likert (1–5). A partir de las respuestas se calculan puntuaciones en distintas dimensiones (control, sumisión, etc.) y se derivan perfiles.

## Estructura del proyecto

```
bdsm-research/
 ├── Main.java
 ├── UI.java
 ├── Question.java
 ├── QuestionBank.java
 ├── Engine.java
 ├── Result.java
 ├── Validator.java
 ├── Exporter.java
 └── RadarChart.java
```

## Componentes principales

* `UI.java`
  Interfaz gráfica en Swing. Gestiona navegación, interacción y visualización de resultados.

* `QuestionBank.java`
  Genera el conjunto de preguntas. Incluye variaciones para cubrir las distintas dimensiones.

* `Engine.java`
  Procesa las respuestas y calcula puntuaciones por dimensión y roles derivados.

* `Validator.java`
  Realiza comprobaciones simples de calidad de respuesta (uniformidad, extremos).

* `RadarChart.java`
  Dibuja un gráfico radial con las dimensiones.

* `Exporter.java`
  Guarda resultados en un archivo CSV.

## Dimensiones

* Control
* Sumisión
* Sadismo
* Masoquismo
* Servicio
* Primalidad
* Hedonismo
* Conducta desafiante (brat)

## Resultados

El sistema devuelve:

* Perfil principal
* Perfil secundario
* Puntuaciones por dimensión (0–100)
* Distribución de roles derivados
* Mensaje interpretativo

También genera un archivo `resultados.csv` con las respuestas y las puntuaciones.

## Requisitos

* Java 8 o superior

Probado con:

* IntelliJ IDEA
* Eclipse

## Ejecución

Compilar y ejecutar `Main.java` desde el IDE o por línea de comandos.

## Salida de datos

Se genera un archivo:

```
resultados.csv
```

Incluye:

* Respuestas por ítem
* Puntuaciones por dimensión

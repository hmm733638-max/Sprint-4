# Publicar esta base hacia SP4

La forma recomendada es reemplazar la implementación actual mediante una rama nueva y un Pull Request, no con un force-push a `SP4`.

## Opción automatizada

Desde PowerShell en la raíz de esta carpeta:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\publish-base-pr.ps1
```

El script:

1. clona la versión más reciente de `SP4`;
2. crea `setup/sp4-base-inmemory`;
3. elimina del árbol los archivos de la implementación anterior;
4. copia esta solución base limpia;
5. crea un commit;
6. hace push de la rama;
7. crea el Pull Request si GitHub CLI (`gh`) está instalado y autenticado; si no, muestra el enlace de comparación para crearlo en el navegador.

## Pull Request esperado

```text
base: SP4
compare: setup/sp4-base-inmemory
```

Título sugerido:

```text
chore: restablecer SP4 como solución base InMemory
```

No se recomienda hacer force-push sobre `SP4`, porque borra historial de trabajo colaborativo. El PR sí reemplaza el contenido actual cuando se hace merge, pero conserva el historial.

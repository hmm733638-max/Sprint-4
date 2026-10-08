# Cómo probar y subir Épica 2

La carpeta ya es un repositorio Git válido y está preparada en la rama local:

```text
SP4-EPICA2-US03-05
```

El remoto `origin` apunta a:

```text
https://github.com/hmm733638-max/Sprint-4.git
```

## 1. Configurar usuarios locales

Desde la raíz del repositorio:

```powershell
python scripts/configure-users.py
```

Si tu instalación usa `python3`:

```powershell
python3 scripts/configure-users.py
```

Reglas actuales de Épica 1:

- ID 1 o 2: Administrador.
- ID 3: Auditor.
- ID 4 en adelante: Cliente.

Los usuarios se almacenan con .NET User Secrets, fuera del repositorio.

## 2. Verificar frontend

```powershell
cd frontend\sahur-web
npm ci
npm run build
cd ..\..
```

## 3. Verificar backend

```powershell
cd backend
dotnet restore Sahur.sln
dotnet build Sahur.sln --configuration Release
dotnet test Sahur.sln --configuration Release
cd ..
```

## 4. Ejecutar

Terminal 1:

```powershell
dotnet run --project backend\Sahur.Api
```

Terminal 2:

```powershell
cd frontend\sahur-web
npm start
```

Abrir:

```text
http://localhost:4200
```

## 5. Probar Épica 2

Cliente/Auditor:

- iniciar sesión;
- visualizar catálogo;
- filtrar categorías;
- abrir detalle;
- comprobar que Editar/Eliminar no aparecen.

Administrador:

- iniciar sesión con ID 1 o 2;
- abrir un detalle;
- editar el producto y guardar;
- eliminar un producto y confirmar;
- volver al catálogo y comprobar los cambios durante esa ejecución de InMemory.

## 6. Revisar antes del commit

```powershell
git status
git diff
git diff --check
```

## 7. Commit sugerido

```powershell
git add .
git diff --cached
git commit -m "feat: implement epic 2 product catalog flow"
```

## 8. Push de la rama nueva

```powershell
git push -u origin SP4-EPICA2-US03-05
```

Después crea el Pull Request:

```text
base: SP4
compare: SP4-EPICA2-US03-05
```

No reutilices la antigua `SP4-US03-05-AUTH`, porque ya perteneció a la implementación anterior basada en la arquitectura vieja.

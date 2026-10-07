#!/usr/bin/env python3
"""Configura usuarios locales sin escribir contraseñas en el repositorio ni en argumentos."""
import getpass
import json
from pathlib import Path
import shutil
import subprocess


def main():
    dotnet = shutil.which('dotnet')
    if not dotnet:
        raise SystemExit('Necesitas .NET 10 en PATH para configurar tus usuarios.')
    project = Path(__file__).resolve().parents[1] / 'backend' / 'Sahur.Api'
    values = {}
    print('Roles: IDs 1 y 2 = Administrador; 3 = Auditor; 4 en adelante = Cliente.')
    print('Configura uno o varios usuarios. Deja el ID vacío para guardar.')
    while True:
        raw_id = input('ID: ').strip()
        if not raw_id:
            break
        if not raw_id.isdigit() or int(raw_id) <= 0:
            print('El ID debe ser un entero positivo.')
            continue
        user_id = int(raw_id)
        username = input('Nombre de usuario: ').strip()
        password = getpass.getpass('Contraseña: ')
        confirmation = getpass.getpass('Repite la contraseña: ')
        if not username or not password.strip() or password != confirmation:
            print('Revisa el nombre y las contraseñas. No se guardó este usuario.')
            continue
        values[f'Seed:Users:{user_id}:Username'] = username
        values[f'Seed:Users:{user_id}:Password'] = password

    if not values:
        print('No se modificó la configuración.')
        return
    result = subprocess.run(
        [dotnet, 'user-secrets', 'set', '--project', str(project)],
        input=json.dumps(values), text=True, capture_output=True
    )
    if result.returncode:
        raise SystemExit('No se pudo guardar la configuración con dotnet user-secrets.')
    print('Usuarios configurados. Reinicia la API en Development para cargarlos.')
    print('Los IDs ya configurados se actualizan; los demás se conservan.')


if __name__ == '__main__':
    main()

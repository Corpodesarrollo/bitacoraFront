import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

export const CanActivatePermisosGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const usuarioService = inject(UsuarioService);

  let canActivate = false;
  if (route.data && route.data['permisos']) {
    const tienePermisos = usuarioService.obtetenerPermisosPerfil(route.data['permisos']);
    canActivate = tienePermisos;
  }

  if (!canActivate) {
    router.navigate(['home/no-autorizado']);
  }
  return canActivate
};

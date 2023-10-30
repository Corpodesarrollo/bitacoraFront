import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

export const personalEditarGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const usuarioService = inject(UsuarioService);
  const perfilUsuario = usuarioService.obtenerPerfilUsuario().nombre;
  const urlActual = state.url;
  let permisosListar:boolean = false;
  let permisosEditar:boolean = false

  usuarioService.permisosActualizados$.subscribe((permisosActualizados) => {
    if (permisosActualizados) {
      permisosListar = usuarioService.obtetenerPermisosPerfil(PermisosUsuarios.PERSONAL_LISTAR)
      permisosEditar = usuarioService.obtetenerPermisosPerfil(PermisosUsuarios.PERSONAL_EDITAR)
    }
  })

  if (perfilUsuario === 'rector' || perfilUsuario === 'coordinador' &&  permisosListar) {
    if (urlActual !== '/home/hojas-de-vida/personal') {
      router.navigate(['home/hojas-de-vida/personal']);
      return false;
    }
  } else if(!permisosListar && perfilUsuario === 'rector' || perfilUsuario === 'coordinador'){
    if (urlActual !== '/home/hojas-de-vida/personal') {
      router.navigate(['home/hojas-de-vida/no-autorizado']);
      return false;
    }
  }
  else {
    if (urlActual !== '/home/hojas-de-vida/personal/editar-datos-funcionario' &&  permisosListar) {
      router.navigate(['home/hojas-de-vida/personal/editar-datos-funcionario']);
      return false;
    }
  }
  return true;
};

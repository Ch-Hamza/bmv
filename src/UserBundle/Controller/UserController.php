<?php

namespace UserBundle\Controller;

use UserBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

class UserController extends Controller
{
    /**
     * @Route("/", name="index")
     */
    public function tAction()
    {
        return $this->redirectToRoute('user_index');
    }

    /**
     * Lists all user entities.
     *
     * @Route("/user", name="user_index")
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $queryBuilder = $em->getRepository(User::class)->createQueryBuilder('u')
            ->where('u.enabled = true');
        if($request->query->getAlnum('filter')) {
            $queryBuilder->where('u.nom LIKE :name')
                ->setParameter('name', '%'.$request->query->getAlnum('filter').'%');
        }

        $query = $queryBuilder->getQuery();
        $paginator = $this->get('knp_paginator');
        $result = $paginator->paginate(
            $query,
            $request->query->getInt('page', 1),
            $request->query->getInt('limit', 10)
        );
        return $this->render('user/index.html.twig', array(
            'users' => $result,
        ));
    }

    /**
     * Creates a new user entity.
     *
     * @Route("/user/new/{role}", name="user_new")
     */
    public function newAction(Request $request, $role)
    {
        $userManger = $this->get('fos_user.user_manager');
        $user = $userManger->createUser();
        $user->setEnabled(true);
        if($role == 'manager')
        {
            $user->setRole('ROLE_MANAGER');
            $user->addRole('ROLE_MANAGER');
        }
        elseif($role == 'user') {
            $user->setRole('ROLE_USER');
            $user->addRole('ROLE_USER');
        }

        $form = $this->createForm('UserBundle\Form\UserType', $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $encoder_service = $this->get('security.encoder_factory');
            $encoder = $encoder_service->getEncoder($user);
            $encoded_pass = $encoder->encodePassword($user->getPassword(), $user->getSalt());
            $user->setPassword($encoded_pass);

            $userManger->updateUser($user);
            return $this->redirectToRoute('user_index');
        }

        return $this->render('user/new.html.twig', array(
            'form' => $form->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing user entity.
     *
     * @Route("/user/{id}/edit", name="user_edit")
     */
    public function editAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository(User::class)->find($id);
        $userManger = $this->get('fos_user.user_manager');
        $form = $this->createForm('UserBundle\Form\UserType', $user);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $userManger->updateUser($user);
            return $this->redirectToRoute('user_index');
        }

        return $this->render('user/edit.html.twig', array(
            'form' => $form->createView(),
        ));
    }

    /**
     * Deletes a user entity.
     *
     * @Route("/user/{id}/delete", name="user_delete")
     */
    public function deleteAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository(User::class)->find($id);
        $user->setEnabled(false);
        $em->flush();

        return $this->redirectToRoute('user_index');
    }
}
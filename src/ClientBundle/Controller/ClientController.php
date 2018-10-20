<?php

namespace ClientBundle\Controller;

use ClientBundle\Entity\Client;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

class ClientController extends Controller
{
    /**
     * Lists all client entities.
     *
     * @Route("/client", name="client_index")
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $queryBuilder = $em->getRepository(Client::class)->createQueryBuilder('u')
            ->where('u.enabled = true');

        if($this->getUser()->getRole() == 'ROLE_MANAGER')
        {
            if($this->getUser()->getService() == 'Technique')
            {
                $queryBuilder->andWhere('u.suivi IS NULL');
            }
            if($this->getUser()->getService() == 'Suivi')
            {
                $queryBuilder->andWhere('u.tech IS NOT NULL');
            }
        }
        elseif ($this->getUser()->getRole() == 'ROLE_USER') {
            $queryBuilder
                    ->andWhere('u.vendor = :param')
                    ->orWhere('u.tech = :param')
                    ->orWhere('u.suivi = :param')
                ->setParameter('param', $this->getUser()->getID());
        }

        if($request->query->getAlnum('filter')) {
            $queryBuilder->andWhere('u.nom LIKE :name')
                ->setParameter('name', '%'.$request->query->getAlnum('filter').'%');
        }

        $query = $queryBuilder->getQuery();
        dump($query);
        $paginator = $this->get('knp_paginator');
        $result = $paginator->paginate(
            $query,
            $request->query->getInt('page', 1),
            $request->query->getInt('limit', 10)
        );
        return $this->render('client/index.html.twig', array(
            'clients' => $result,
        ));
    }

    /**
     * Creates a new client entity.
     *
     * @Route("/client/new", name="client_new")
     */
    public function newAction(Request $request)
    {
        if($this->getUser()->getRole() == 'ROLE_MANAGER' || $this->getUser()->getService() == 'Sales' || $this->get('security.authorization_checker')->isGranted('ROLE_ADMIN'))
        {
            $client = new Client();
            $client->setEnabled(true);
            $client->setVendor($this->getUser());

            $form = $this->createForm('ClientBundle\Form\ClientType', $client);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {

                $em = $this->getDoctrine()->getManager();
                $em->persist($client);

                $em->flush();

                return $this->redirectToRoute('client_index');
            }

            return $this->render('client/new.html.twig', array(
                'form' => $form->createView(),
            ));
        }
        else {
            return $this->redirectToRoute('client_index');
        }
    }

    /**
     * Displays a form to edit an existing client entity.
     *
     * @Route("/client/{id}/edit", name="client_edit")
     */
    public function editAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $client = $em->getRepository(Client::class)->find($id);
        if($this->getUser()->getService() == 'Technique' && $this->getUser()->getRole() == 'ROLE_MANAGER')
        {
            $form = $this->createForm('ClientBundle\Form\ClientTech', $client);
        }
        elseif($this->getUser()->getService() == 'Suivi' && $this->getUser()->getRole() == 'ROLE_MANAGER')
        {
            $form = $this->createForm('ClientBundle\Form\ClientSuivi', $client);
        }
        elseif($this->get('security.authorization_checker')->isGranted('ROLE_ADMIN'))
        {
            $form = $this->createForm('ClientBundle\Form\ClientBoth', $client);
        }
        else {
            $form = $this->createForm('ClientBundle\Form\ClientType', $client);
        }
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();
            return $this->redirectToRoute('client_index');
        }

        return $this->render('client/edit.html.twig', array(
            'form' => $form->createView(),
        ));
    }

    /**
     * Deletes a client entity.
     *
     * @Route("/client/{id}/delete", name="client_delete")
     */
    public function deleteAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $client = $em->getRepository(Client::class)->find($id);
        $client->setEnabled(false);
        $em->flush();

        return $this->redirectToRoute('client_index');
    }
}

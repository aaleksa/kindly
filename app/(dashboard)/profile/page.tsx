import { getItems } from '@/supabase/models/getItems';

//Components
import ItemCard from '@/components/ItemCard';
import Modal from '@/components/Modal';
//Components
import { getProfile } from '@/supabase/models/getProfile';
import LogOutButton from '@/components/LogOutButton';
import { ProfileEdit } from '@/components/form/ProfileEdit';
import newServerClient from '@/supabase/utils/newServerClient';

const ProfilePage = async () => {
  try {
    const supabase = newServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userProfile = await getProfile(user?.id);
    const fetchedItems = await getItems('items', '', 'donated_by', user?.id);

    if (!userProfile?.data || !userProfile?.data.username || !user?.id) {
      return <div>Error User profile not found or username is missing</div>;
    }
    return (
      <>
        <div className='mt-10 flex items-center justify-between px-5 md:px-20 lg:px-40'>
          <div className='px-5 py-2'>
            <h1 className='pl-3 text-2xl'>Profile</h1>
            <div className='mt-2 flex gap-3'>
              <h2 className='italic'>{userProfile?.data.username}</h2>
              <LogOutButton>LOG OUT</LogOutButton>
            </div>
          </div>
          <div className='mt-10 flex flex-col items-center justify-between gap-4 px-4'>
            {userProfile?.data.avatar ? (
              <img
                src={userProfile?.data.avatar}
                alt='User avatar'
                width={100}
                height={100}
                className='rounded-full'
              />
            ) : (
              <img
                src='/default-profile.png'
                alt='Default avatar'
                width={100}
                height={100}
                className='rounded-full'
              />
            )}
            <ProfileEdit
              userId={user.id}
              userName={userProfile.data.username}
              userAvatar={userProfile.data.avatar}
            />
          </div>
        </div>
        <div className='m-auto mt-10 w-5/6'>
          <h1 className='m-5 text-lg font-medium md:pl-20 lg:pl-40'>
            My donated items:
          </h1>

          {fetchedItems && fetchedItems.length > 0 ? (
            <ul className='flex flex-col items-center gap-10'>
              {fetchedItems.map((item) => (
                <li key={item.id}>
                  <ItemCard
                    imageSrc={item.imageSrc}
                    item_name={item.item_name}
                    condition={item.condition}
                    postcode={item.postcode}
                    postable={item.postable}
                    itemId={item.id}
                  />
                  <Modal
                    name='Delete Item'
                    itemId={item.id}
                    message='By pressing Confirm you will delete this item'
                  />
                </li>
              ))}
            </ul>
          ) : (
            <h2 className='m-5 text-lg font-thin'>
              You have not donated any items.
            </h2>
          )}
        </div>
      </>
    );
  } catch (error) {
    return <div>An error has occured</div>;
  }
};

export default ProfilePage;
